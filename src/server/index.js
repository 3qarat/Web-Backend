import express from "express";
import config from "./config/config.js";
import restRouter from "./api/api.routes.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import AppError from "./utils/appError.js";
import cookieParser from "cookie-parser";
import "./api/resources/user/passportConfig.js";
import cors from "cors";
import session from "express-session";
import passport from "passport";

const app = express();

//mw
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//routes
app.use("/api", restRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// global error handler
app.use(globalErrorHandler);

//start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
