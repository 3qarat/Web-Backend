import catchAsync from "../../../utils/catchAsync.js";
import * as feedbackService from "./feedback.service.js";

export const createFeedback = catchAsync(async (req, res, next) => {
  await feedbackService.createFeedback(
    req.user.id,
    req?.body?.apartment_id,
    req?.body?.comment,
    req?.body?.rating
  );

  res.status(201).json({
    status: "success",
    message: "feedback added successfully",
  });
});

export const deleteFeedback = catchAsync(async (req, res, next) => {
  await feedbackService.deleteFeedback(req.body.feedback_id);

  res.status(200).json({
    status: "success",
    message: "feedback deleted successfully",
  });
});

export const updateFeedback = catchAsync(async (req, res, next) => {
  await feedbackService.updateFeedback(
    req?.body?.comment,
    req?.body?.rating,
    req?.body?.feedback_id
  );

  res.status("200").json({
    status: "success",
    message: "feedback updated successfully",
  });
});

export const getApartmentFeedback = catchAsync(async (req, res, next) => {
  const feedbacks = await feedbackService.getApartmentFeedback(req?.params?.id);

  res.status(200).json({
    status: "success",
    data: {
      feedbacks,
    },
  });
});
