import { Router } from "express";
import userRoutes from "./resources/user/user.routes.js";

const restRouter = new Router();

restRouter.use("/v1/user", userRoutes);

export default restRouter;
