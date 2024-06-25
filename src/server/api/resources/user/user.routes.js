import { Router } from "express";
import * as userController from "./user.controller.js";
import { protectedRoute } from "./passportConfig.js";
import passport from "./googleStrategyConfig.js";
import AppError from "../../../utils/appError.js";

const router = new Router();

//auth routes
router
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));
router
  .route("/auth/google/callback")
  .get(
    passport.authenticate("google", { failureRedirect: false }),
    (req, res, next) => {
      if (req.user) {
        res.status(200).json({
          status: "success",
          data: {
            user: req.user,
          },
        });
      } else {
        next(new AppError("Authentication failed", 401));
      }
    }
  );
  
router.route("/logout").get((req, res) => {
  req.logout();
  res.status(200).json({
    status: "success",
    message: "logged out successfully",
  });
});

// router.route("/signup").post(userController.signup);
// router.route("/login").post(userController.login);
// router.route("/logout").get(protectedRoute, userController.logout);

export default router;
