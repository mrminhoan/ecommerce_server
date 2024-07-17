"use strict";
const { mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const JWT = require("jsonwebtoken");

const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.services");
const { createTokenPair, genKey } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static handleRefreshToken = async (refreshToken) => {
    // Check refresh token is used ?
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );

    // Xem user gửi refresh token hết hạn, đã sử dụng lên là ai:
    // Nếu Có

    console.log("Debug here:>>>>>>", foundToken);
    if (foundToken) {
      const { userId, email } = await this.verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log({ userId, email });
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happen! PLes login again");
    }

    // Nếu chưa có
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    console.log("Check HolderToken: ", holderToken);

    if (!holderToken) throw new AuthFailureError("Shop not registed");

    // Verify Token
    const { userId, email } = await this.verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    // Check userId
    const foundShop = await findByEmail(email);
    if (!foundShop) throw new AuthFailureError("Shop not registed");

    // Create new access Token and refresh Token
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );
    try {
      await holderToken.updateOne(
        { _id: new mongoose.Types.ObjectId(foundShop._id) },
        {
          $set: {
            refreshToken: tokens.refreshToken,
          },
          $addToSet: {
            refreshTokenUsed: refreshToken,
          },
        }
      );
    } catch (error) {
      console.log({ error });
    }

    return {
      user: { userId, email },
      tokens,
    };
  };

  static login = async ({ email, password, refreshToken }) => {
    /*
    ? 1- Check email in dbs
    ? 2- Match password
    ? 3- Create Access token and Refresh token
    ? 4- Generate tokens
    ? 5- Get data return login
    */

    //  1
    const foundShop = await findByEmail(email);
    if (!foundShop) throw new BadRequestError("Shop's not registered");

    //  2
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication Error");

    //3
    const privateKey = await genKey();
    const publicKey = await genKey();
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    // 4
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    const hodelShop = await shopModel.findOne({ email }).lean();
    if (hodelShop) {
      throw new BadRequestError("Error: Shop already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: RoleShop.SHOP,
    });
    if (newShop) {
      // const { privateKey, publicKey } = await crypto.generateKeyPairSync(
      //   "rsa",
      //   {
      //     modulusLength: 4096,
      //     publicKeyEncoding: {
      //       type: "pkcs1",
      //       format: "pem",
      //     },
      //     privateKeyEncoding: {
      //       type: "pkcs1",
      //       format: "pem",
      //     },
      //   }
      // );

      // created privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new ConflictRequestError("Error: publicKeyString error");
      }
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };

  static signOut = async (keyStore) => {
    const delKey = await KeyTokenService.removeById(keyStore._id);
    console.log({ delKey });
    return delKey;
  };
  static verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
  };
}

module.exports = AccessService;
