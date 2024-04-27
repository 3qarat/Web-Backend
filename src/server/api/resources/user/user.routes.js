import { Router } from "express";
import * as userController from "./user.controller.js";
import { protectedRoute } from "./passportConfig.js";

const router = new Router();

router.route("/signup").post(userController.signup);
router.route("/login").post(userController.login);
router.route("/logout").get(protectedRoute, userController.logout);

export default router;
