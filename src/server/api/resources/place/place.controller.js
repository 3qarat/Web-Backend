import * as placeService from "./place.service.js";
import catchAsync from "../../../utils/catchAsync.js";

export const createPlace = catchAsync(async (req, res, next) => {
  console.log(req.body, req.user.id);
  const placeId = await placeService.createPlace(req.body, req.user.id);

  res.status(201).json({
    status: "success",
    data: {
      placeId,
    },
  });
});

export const getAllPlaces = catchAsync(async (req, res, next) => {
  const places = await placeService.getAllPlaces(req.query);

  res.status(200).json({
    status: "success",
    data: {
      places,
    },
  });
});

export const getPlaceById = catchAsync(async (req, res, next) => {
  const place = await placeService.getPlaceById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      place,
    },
  });
});

export const updatePlaceById = catchAsync(async (req, res, next) => {
  const placeId = await placeService.updatePlaceById(req.body, req.params.id);

  res.status(200).json({
    status: "success",
    message: `place with ID ${placeId} updated successfully`,
  });
});

export const deletePlaceById = catchAsync(async (req, res, next) => {
  await placeService.deletePlaceById(req.params.id);

  res.status(200).json({
    status: "success",
    message: "deleted successfully",
  });
});
