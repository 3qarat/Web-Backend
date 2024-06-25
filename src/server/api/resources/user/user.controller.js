import catchAsync from "../../../utils/catchAsync.js";
import * as userService from "./user.service.js";
import AppError from "../../../utils/appError.js";
import passport from "passport";

export const signup = catchAsync(async (req, res, next) => {
  const user_id = await userService.signup(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user_id,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const token = await userService.login(req.body);
  res.cookie("jwt", token, { httpOnly: true, secure: false });

  res.status(200).json({
    status: "success",
    message: "logged in successfully",
  });
});

export const logout = catchAsync(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.cookie("jwt", "", { expires: new Date(0), httpOnly: true });
    res.status(200).json({
      status: "success",
      message: "logged out successfully",
    });
  });
});

// protected routes
export const protectedRoute = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      req.user = user;
      return next();
    }

    // If JWT authentication fails, check for Google OAuth session
    if (req.isAuthenticated()) {
      return next();
    }

    // If neither authentication method works, respond with unauthorized status
    return next(new AppError('please login to get access', 401))
  })(req, res, next);
};
