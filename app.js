const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

app.use("/", (req, res) => {
  res.send({
    message: "hello world!",
  });
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
