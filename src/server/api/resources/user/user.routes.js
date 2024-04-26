import { Router } from "express";
import * as userController from "./user.controller.js";

const router = new Router();

router.route("/signup").post(userController.signup);

export default router;
