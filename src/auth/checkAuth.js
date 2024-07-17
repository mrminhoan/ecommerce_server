"use strict";
const { findById } = require("../services/apikey.service");
const { HEADER } = require("../constants");
// const HEADER = {
//   API_KEY: "x-api-key",
//   AUTHORIZATION: "authorization",
// };

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER["API_KEY"]?.toString()];
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(error);
    return error;
  }
};

const checkPermission = (permission) => {
  try {
    return (req, res, next) => {
      if (!req.objKey.permissions) {
        return res.status(403).json({
          message: "permission denied",
        });
      }
      const validPermission = req.objKey.permissions?.includes(permission);
      if (!validPermission) {
        return res.status(403).json({
          message: "permission denied",
        });
      }
      return next();
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  checkPermission,
  asyncHandler,
};
