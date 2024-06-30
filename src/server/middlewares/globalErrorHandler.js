import config from "../config/config.js";
import AppError from "../utils/appError.js";
const handleDuplicateFieldsDB = (err) => {
  const regex = /(?:\.)(\w+)/; //from chatgpt
  const match = err.message.match(regex)[1];

  const message = `Duplicate field value: ${match}. Please use another value!`;
  return new AppError(message, 400);
};

const handleInvalidDate = (err) => {
  return new AppError("Invalid date", 400);
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.sqlState == 23000) err = handleDuplicateFieldsDB(err);
  if (err.sqlState == 22007) err = handleInvalidDate(err);

  if (config.NODE_ENV == "development" || config.NODE_ENV == "test") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
    });
  } else if (config.NODE_ENV.startWith('prod')) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "something went wrong!",
      });
    }
  }
};

/*
  - Duplicate entry ->  "sqlState": "23000"
*/
