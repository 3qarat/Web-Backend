import { Router } from "express";
import * as favoritesController from "./favorites.controller.js";
import { protectedRoute } from "../user/user.controller.js";

const router = new Router();

router.use(protectedRoute);
router
  .route("/:apartmentId")
  .post(favoritesController.addToFavorites)
  .delete(favoritesController.removeFromFavorites);

router.route("/").get(favoritesController.getUserFavorites);

export default router;
