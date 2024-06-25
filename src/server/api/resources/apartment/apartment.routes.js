import { Router } from "express";
import { protectedRoute } from "../user/passportConfig.js";
import * as apartmentController from "./apartment.controller.js";
import { ensureAuthenticated } from "../user/user.service.js";

const router = new Router();

router.use(ensureAuthenticated);
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
