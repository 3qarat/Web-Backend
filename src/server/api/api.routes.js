import { Router } from "express";
import userRoutes from "./resources/user/user.routes.js";
import apartmentRoutes from "./resources/apartment/apartment.routes.js";

const restRouter = new Router();

restRouter.use("/v1/user", userRoutes);
restRouter.use("/v1/apartment", apartmentRoutes);

export default restRouter;
