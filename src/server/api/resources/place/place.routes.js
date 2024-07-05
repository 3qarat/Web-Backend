import * as placeController from "./place.controller.js";
import { Router } from "express";
import { protectedRoute } from "../user/user.controller.js";

const router = new Router();

router
  .route("/")
  .post(protectedRoute, placeController.createPlace)
  .get(placeController.getAllPlaces);

router
  .route("/:id")
  .get(placeController.getPlaceById)
  .patch(protectedRoute, placeController.updatePlaceById)
  .delete(protectedRoute, placeController.deletePlaceById);

export default router;
