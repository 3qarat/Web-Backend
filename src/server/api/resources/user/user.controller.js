import catchAsync from "../../../utils/catchAsync.js";
import * as userService from "./user.service.js";

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
  res.cookie("jwt", "", { expires: new Date(0), httpOnly: true });

  res.status(200).json({
    status: "success",
    message: "logged out successfully",
  });
});
