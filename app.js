const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// import routes
const cars = require("./routes/cars");
const users = require("./routes/users");
const reservations = require("./routes/reservations");

// connect to database using mongoose
// mongoose.connect(process.env.ATLAS, {
mongoose.connect("mongodb://localhost:27017/presta", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// log on successful connection
mongoose.connection.on("connected", () => {
  console.log("Connected to the database");
});

// app level middleware
// logs the method
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// serve static files
app.use("/public", express.static("assets/images"));

// parse incoming requests to json format
// this will create body attribute to req object
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello");
});

// routes middlewares
app.use("/cars", cars);
app.use("/users", users);
app.use("/reservations", reservations);

// error handling middleware
app.use((err, req, res, next) => {
  res.status(400).send({
    error: err.message,
  });
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
