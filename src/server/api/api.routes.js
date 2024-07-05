import { Router } from "express";
import userRoutes from "./resources/user/user.routes.js";
import apartmentRoutes from "./resources/apartment/apartment.routes.js";
import transactionRoutes from "./resources/transaction/transaction.routes.js";
import favoritesRoutes from "./resources/favorites/favorites.routes.js";
import feedbackRoutes from "./resources/feedback/feedback.routes.js";
import placeRoutes from "./resources/place/place.routes.js";

const restRouter = new Router();

restRouter.use("/v1/user", userRoutes);
restRouter.use("/v1/apartment", apartmentRoutes);
restRouter.use("/v1/transaction", transactionRoutes);
restRouter.use("/v1/favorites", favoritesRoutes);
restRouter.use("/v1/feedback", feedbackRoutes);
restRouter.use("/v1/place", placeRoutes);

export default restRouter;
