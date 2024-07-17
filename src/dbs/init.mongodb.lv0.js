"use strict";
const { default: mongoose } = require("mongoose");

const UserDatabase = "user";
const PassDatabase = "123123aA";

const connectString = `mongodb+srv://${UserDatabase}:${PassDatabase}@cluster0.nqod5ih.mongodb.net/`;

mongoose
  .connect(connectString)
  .then((_) => console.log("Connected Mongodb Success"))
  .catch((err) => console.log("Error Connect: ", err));

if (1 === 0) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
