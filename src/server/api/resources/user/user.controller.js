import catchAsync from "../../../utils/catchAsync.js";
import * as userService from "./user.service.js";

export const signup = catchAsync(async (req, res, next) => {
  const result = await userService.signup(req.body);

  res.status(201).json({
    status: "success",
    data: result,
  });
});
