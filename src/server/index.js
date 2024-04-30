import express from "express";
import config from "./config/config.js";
import restRouter from "./api/api.routes.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import AppError from "./utils/appError.js";
import cookieParser from "cookie-parser";
import "./api/resources/user/passportConfig.js";
import cors from "cors";

const app = express();

//mw
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api", restRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// global error handler
app.use(globalErrorHandler);
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
