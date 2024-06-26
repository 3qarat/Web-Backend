import { Router } from "express";
import * as userController from "./user.controller.js";
import passport from "./passportConfig.js";
import AppError from "../../../utils/appError.js";

const router = new Router();


//                                                           >>>>>>> Auth Routes <<<<<<<
//google-based auth routes
router.route("/auth/google").get(userController.googleLogin);
router.route("/auth/google/callback").get(userController.googleCallback);

//local-based auth routes
router.route("/login").post(userController.login);

// general auth routes
router.route("/signup").post(userController.signup);
router.route("/logout").get(userController.logout);

export default router;
