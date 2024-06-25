import { Router } from "express";
import * as apartmentController from "./apartment.controller.js";
import { protectedRoute } from "../user/user.controller.js";

const router = new Router();

router.use(protectedRoute)
router
  .route("/")
  .post(apartmentController.createApartment)
  .get(apartmentController.getAllApartmentsBasedOnFilters);
router
  .route("/:id")
  .get(apartmentController.getApartmentById)
  .put(apartmentController.updateApartmentById)
  .patch(apartmentController.dynamicUpdateApartmentById)
  .delete(apartmentController.deleteApartmentById);

export default router;
