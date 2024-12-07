import { Router } from "express";
import * as feedbackController from "./feedback.controller.js";
import { protectedRoute } from "../user/user.controller.js";

const router = new Router();

router.use(protectedRoute);
router
  .route("/")
  .post(feedbackController.createFeedback)
  .patch(feedbackController.updateFeedback)
  .delete(feedbackController.deleteFeedback);

router.route("/:id").get(feedbackController.getApartmentFeedback);

export default router;
