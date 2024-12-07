import { Router } from "express";
import * as apartmentController from "./apartment.controller.js";
import { protectedRoute } from "../user/user.controller.js";
import upload from "../../../config/multerConfig.js";

const router = new Router();

router
  .route("/")
  .post(
    protectedRoute,
    upload.array("photos", 10),
    apartmentController.createApartment
  )
  .get(apartmentController.getAllApartmentsBasedOnFilters);
router
  .route("/:id")
  .get(apartmentController.getApartmentById)
  //.put(protectedRoute, apartmentController.updateApartmentById)
  .patch(protectedRoute, apartmentController.dynamicUpdateApartmentById)
  .delete(protectedRoute, apartmentController.deleteApartmentById);

export default router;
