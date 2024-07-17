const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
require("dotenv").config();

const app = express();

// init middleware
app.use(morgan("dev"));
// ?curl http://localhost:4000 --include
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// init database
require("./dbs/init.mongodb.js");
const { checkOverload } = require("./helpers/check.connect.js");
checkOverload();

// init routes
app.use("/", require("./routes"));

// Handling errors

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
