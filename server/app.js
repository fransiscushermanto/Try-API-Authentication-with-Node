const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const connectionString = "mongodb://localhost/APIAuthentication",
  connectionStringDev = "mongodb://localhost/APIAuthenticationTest";

if (process.env.NODE_ENV === "test") {
  mongoose.connect(connectionStringDev, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
} else {
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
}

const app = express();

//Middlewares
if (!process.env.NODE_ENV === "test") {
  app.use(morgan("dev"));
}
app.use(bodyParser.json());

//Routes
app.use("/users", require("./routes/users"));

module.exports = app;
