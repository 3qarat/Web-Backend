import express from "express";
import config from "./config/config.js";

const app = express();

//mw
app.use(express.json());

app.get("/", async (req, res, next) => {
  const result = await pool.query("show tables");
  res.json({
    status: "success",
    message: "hello world",
  });
});

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
