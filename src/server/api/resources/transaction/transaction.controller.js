import catchAsync from "../../../utils/catchAsync.js";
import * as transactionService from "./transaction.service.js";

export const createTransaction = catchAsync(async (req, res, next) => {
  const insertId = await transactionService.createTransaction(req.body);

  res.status(201).json({
    status: "success",
    data: {
      insertId,
    },
  });
});
