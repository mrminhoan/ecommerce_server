"use strict";
const crypto = require("crypto");
const apiKeyModel = require("../models/apikey.model");

const findById = async (key) => {
  // const newKey = await apikeyModel.create({
  //   key: crypto.randomBytes(64).toString("hex"),
  //   status: true,
  //   permissions: ["0000"],
  // });
  // console.log({ newKey });
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findById,
};
