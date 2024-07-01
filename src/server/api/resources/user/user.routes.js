import { Router } from "express";
import * as userController from "./user.controller.js";
import { protectedRoute } from "./user.controller.js";
import upload from "../../../config/multerConfig.js";

const router = new Router();

//                                                           >>>>>>> Auth Routes <<<<<<<
//google-based auth routes
router.route("/auth/google").get(userController.googleLogin);
router.route("/auth/google/callback").get(userController.googleCallback);

//local-based auth routes
router.route("/login").post(userController.login);

// general auth routes
router.route("/signup").post(upload.single("profile_picture"), userController.signup);
router
  .route("/updatePassword")
  .post(userController.protectedRoute, userController.updatePassword);
router.route("/forgot-password").post(userController.generateResetToken);
router.route("/verify-token").post(userController.verifyToken);
router.route("/reset-password/:token").post(userController.resetPassword);
router.route("/logout").get(userController.logout);

//user services
router.route("/partners").get(userController.getAllPartners);
router.route("/partners/:id").get(userController.getAllPartnerApartments);
router.route("/").patch(userController.updateUserById);
export default router;
