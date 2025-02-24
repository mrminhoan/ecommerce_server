"use strict";

const keyTokenModel = require("../models/keytoken.model");
const { ErrorResponse } = require("../core/error.response");
const mongoose = require("mongoose");
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // ? Level 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null;

      // ? Level xxx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          // refreshTokensUsed,
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      throw ErrorResponse();
    }
  };
  static findByUserId = async (userId) => {
    const _userId = new mongoose.Types.ObjectId(userId);
    return await keyTokenModel.findOne({ user: _userId }).lean();
  };
  static removeById = async (id) => {
    const deleteKey = await keyTokenModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
    });
    return deleteKey;
  };
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken }).lean();
  };
  static deleteKeyById = async (userId) => {
    return await keyTokenModel.findOneAndDelete({
      user: new mongoose.Types.ObjectId(userId),
    });
  };
  static updateByFilter = async ({ filter, update }) => {
    return await keyTokenModel.updateOne(filter, update);
  };
}

module.exports = KeyTokenService;
