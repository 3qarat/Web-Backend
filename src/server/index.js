import express from "express";
const app = express();

//mw
app.use(express.json());

app.get("/", (req, res, next) => {
  res.json({
    status: "success",
    message: "hello world",
  });
});

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
