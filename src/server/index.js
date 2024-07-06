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
import createTables from "./api/database/createTables.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//mw
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser());
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 h
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/api", restRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// global error handler
app.use(globalErrorHandler);

//start server

const PORT = config.PORT;
// if (config.NODE_ENV == "development") {
//   app.listen(PORT, () => {
//     console.log(`app is listening on port ${PORT}`);
//   });
// } else if (config.NODE_ENV == "production") {
createTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`app is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error creating tables:", error);
  });
// }
