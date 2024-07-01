import { Router } from "express";
import * as apartmentController from "./apartment.controller.js";
import { protectedRoute } from "../user/user.controller.js";

const router = new Router();

router
  .route("/")
  .post(protectedRoute, apartmentController.createApartment)
  .get(apartmentController.getAllApartmentsBasedOnFilters);
router
  .route("/:id")
  .get(apartmentController.getApartmentById)
  .put(protectedRoute, apartmentController.updateApartmentById)
  .patch(protectedRoute, apartmentController.dynamicUpdateApartmentById)
  .delete(protectedRoute, apartmentController.deleteApartmentById);

export default router;
