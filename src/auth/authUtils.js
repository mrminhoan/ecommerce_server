"use strict";
const crypto = require("crypto");
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { HEADER } = require("../constants/index");
const { NotFoundError, AuthFailureError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.services");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "1h",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`error verify: `, err);
      } else {
        console.log(`Decode verify`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const genKey = async (size = 64, format = "hex") => {
  return crypto.randomBytes(size).toString(format);
};
const authenticationV2 = asyncHandler(async (req, res, next) => {
  /*
    1- Check userId missing ?
    2- Check keyStore in DB with useId ?
    3- Check access token missing || Check refresh token missing ? 
    4- Check user in accessToken || refresh token with userId
    5- oke all => return next
  */
  // 1-
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  // 3-
  const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
  if (refreshToken) {
    // 4-
    try {
      req.user = userId;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }
  // 2-
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not Found keyStore");

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");
  // 4-
  try {
    const decode = JWT.verify(accessToken, keyStore.publicKey);
    if (decode.userId !== userId) throw new AuthFailureError("Invalid User");
    req.keyStore = keyStore;
    req.user = decode;
    return next();
  } catch (error) {
    throw error;
  }
});

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1- Check userId missing ?
    2- Check keyStore in DB with useId ?
    3- Check accessToken missing ? 
    4- Check user in accessToken with userId
    5- oke all => return next
  */

  // 1-
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  // 2-
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not Found keyStore -2");

  // 3-
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  // console.log("Debug: >>>>", keyStore);

  // 4-
  try {
    const decode = JWT.verify(accessToken, keyStore.publicKey);
    if (decode.userId !== userId) throw new AuthFailureError("Invalid User");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  createTokenPair,
  genKey,
  authentication,
  authenticationV2,
};
