"use strict";
const { default: mongoose } = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const config = require("../configs/config");

const connectString = `mongodb+srv://${config.db.user_name}:${config.db.password}@cluster0.nqod5ih.mongodb.net/${config.db.db_name}`;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    // For dev
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => {
        console.log("Connected Mongodb Success");
        countConnect();
      })
      .catch((err) => console.log("Error Connect: ", err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
