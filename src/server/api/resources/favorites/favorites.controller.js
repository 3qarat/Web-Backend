import catchAsync from "../../../utils/catchAsync.js";
import * as favoritesService from "./favorites.service.js";

export const addToFavorites = catchAsync(async (req, res, next) => {
  const message = await favoritesService.addToFavorites(
    req.user.id,
    req.params.apartmentId
  );

  res.status(message.includes("failed") ? 404 : 200).json({
    status: message.includes("failed") ? "fail" : "success",
    message: message,
  });
});

export const removeFromFavorites = catchAsync(async (req, res, next) => {
  await favoritesService.removeFromFavorites(
    req.user.id,
    req.params.apartmentId
  );

  res.status(200).json({
    status: "success",
  });
});

export const getUserFavorites = catchAsync(async (req, res, next) => {
  const apartments = await favoritesService.getUserFavorites(req.user.id);

  res.status(200).json({
    status: "success",
    data: {
      apartments,
    },
  });
});
