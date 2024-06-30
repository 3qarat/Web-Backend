import { Router } from "express";
import * as feedbackController from "./feedback.controller.js";

const router = new Router();

router
  .route("/")
  .post(feedbackController.createFeedback)
  .patch(feedbackController.updateFeedback)
  .delete(feedbackController.deleteFeedback);

router.route("/:id").get(feedbackController.getApartmentFeedback);

export default router;
