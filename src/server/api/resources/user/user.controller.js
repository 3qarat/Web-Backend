import catchAsync from "../../../utils/catchAsync.js";
import * as authService from "./auth.service.js";
import * as userService from "./user.service.js";
import AppError from "../../../utils/appError.js";
import passport from "passport";
import pool from "../../database/index.js";

// Auth
export const signup = catchAsync(async (req, res, next) => {
  const user_id = await authService.signup(req.body, req.file);
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

export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.email == "hashem@email") {
    next();
  } else {
    next(
      new AppError(
        "you are not authorized to perform this action, only for admins",
        401
      )
    );
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

//user service
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

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  console.log(req.user);
  await userService.updateMe(req.body, req.user.id);

  res.status(200).json({
    status: "success",
    message: "user data updated successfully",
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await userService.deleteMe(req.user.id);

  res.status(200).json({
    status: "success",
    message: "user deleted successfully",
  });
});
