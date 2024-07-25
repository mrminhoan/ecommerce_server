"use strict";
const { SuccessResponse } = require("../core/success.response");
const { ProductFactory } = require("../services/product.serviceV2");
class ProductController {
  static createProduct = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create production success",
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = ProductController;
