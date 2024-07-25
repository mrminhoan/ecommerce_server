"use strict";

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {
  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Get token success",
      metadata: await AccessService.handleRefreshTokenV3({
        user: req.user,
        refreshToken: req.refreshToken,
      }),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    return new CREATED({
      message: "Register OK!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);

    // ? Cách viết khác dễ nhìn hơn:
    // const metadata = await AccessService.signUp(req.body);
    // const response = new CREATED({
    //   message: "Register OK!",
    //   metadata,
    // });
    // response.send(res);
  };

  signIn = async (req, res, next) => {
    return new SuccessResponse({
      message: "Login OK!",
      metadata: await AccessService.login(req.body),
    }).send(res);

    // ? Cách viết khác dễ nhìn hơn:
    // const metadata = await AccessService.signUp(req.body);
    // const response = new CREATED({
    //   message: "Register OK!",
    //   metadata,
    // });
    // response.send(res);
  };
  signOut = async (req, res, next) => {
    return new SuccessResponse({
      message: "LogOut successfully",
      metadata: await AccessService.signOut(req.keyStore),
    }).send(res);
  };
}

module.exports = new AccessController();
