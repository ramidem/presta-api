const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

// import routes
const cars = require("./routes/cars");
const users = require("./routes/users");

// app level middleware
// logs the method
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// parse incoming requests to json format
// this will create body attribute to req object
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

// routes middlewares
app.use("/cars", cars);
app.use("/users", users);

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
