import { Router } from "express";
import * as transactionController from "./transaction.controller.js";

const router = new Router();

router.route("/").post(transactionController.createTransaction);

export default router;
