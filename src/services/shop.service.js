"use strict";
const mongoose = require("mongoose");
const shopModel = require("../models/shop.model");

async function findShopByEmail(
  email,
  select = {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: 1,
  }
) {
  return await shopModel.findOne({ email }).select(select).lean();
}
async function findShopById(
  userId,
  select = {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: 1,
  }
) {
  return await shopModel
    .findOne({
      _id: new mongoose.Types.ObjectId(userId),
    })
    .select(select)
    .lean();
}

module.exports = {
  findShopByEmail,
  findShopById,
};
