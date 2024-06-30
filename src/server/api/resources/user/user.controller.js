import catchAsync from "../../../utils/catchAsync.js";
import * as authService from "./auth.service.js";
import * as userService from "./user.service.js";
import AppError from "../../../utils/appError.js";
import passport from "passport";

export const signup = catchAsync(async (req, res, next) => {
  const user_id = await authService.signup(req.body);
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

export const protectedRoute = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    next(new AppError("please login to get access", 401));
  }
};

export const updatePassword = catchAsync(async (req, res, next) => {
  const message = await authService.updatePassword(
    req.user.id,
    req.body.password
  );

  res.status(200).json({
    status: message.startsWith("failed") ? "fail" : "success",
    message,
  });
});

export const generateResetToken = catchAsync(async (req, res, next) => {
  await authService.generateResetToken(req.body.email, req);

  res.status(200).json({
    status: "success",
    message: "Password reset email sent",
  });
});

export const verifyToken = catchAsync(async (req, res, next) => {
  await authService.verifyToken(req.body.token);

  res.status(200).json({
    status: "success",
    message: "token is valid",
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  await authService.resetPassword(req.params.token, req.body.password);

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});

export const getAllPartners = catchAsync(async (req, res, next) => {
  const partners = await userService.getAllPartners();

  res.status(200).json({
    status: "success",
    data: {
      partners,
    },
  });
});

export const getAllPartnerApartments = catchAsync(async (req, res, next) => {
  const apartments = await userService.getAllPartnerApartments(req.params.id);

  res.status(200).json({
    status: "success",
    length: apartments.length,
    data: {
      apartments,
    },
  });
});
