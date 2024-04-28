import { Router } from "express";
import { protectedRoute } from "../user/passportConfig.js";
import * as apartmentController from "./apartment.controller.js";

const router = new Router();

router.use(protectedRoute);
router
  .route("/")
  .post(apartmentController.createApartment)
  .get(apartmentController.getAllApartments);
router
  .route("/:id")
  .get(apartmentController.getApartmentById)
  .put(apartmentController.updateApartment)
  .delete(apartmentController.deleteApartment);

export default router;
