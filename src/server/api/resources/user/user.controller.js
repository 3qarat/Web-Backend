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
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new AppError(info.message), 401);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ status: "success", data: { user } });
    });
  })(req, res, next);
});

export const googleLogin = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

export const googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new AppError("Authentication failed", 401));
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res
        .status(200)
        .json({ message: "Login successful", data: { user } });
    });
  })(req, res, next);
};

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
  if (req.isAuthenticated()) {
    next();
  } else {
    next(new AppError("please login to get access", 401));
  }
};
