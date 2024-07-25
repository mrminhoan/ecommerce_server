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

  // QUERY//

  /**
   * @desc Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @returns {JSON }
   */
  // static searchProductByUser = async (req,res,next) =>{
  //   return new
  // }
  static searchProductByUser = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get list Draft success",
      metadata: await ProductFactory.searchProductByUser({
        keyword: req.params.keyword,
      }),
    }).send(res);
  };

  static getAllDraftsForShop = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get list Draft success",
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  };
  static getAllPublishedForShop = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get list Published Success",
      metadata: await ProductFactory.findAllPublishedForShop({
        product_shop: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  };

  static publishDraftsForShop = async (req, res, next) => {
    return new SuccessResponse({
      message: "Publish product success",
      metadata: await ProductFactory.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
        ...req.body,
      }),
    }).send(res);
  };

  static unPublishProductForShop = async (req, res, next) => {
    return new SuccessResponse({
      message: "UnPublish product success",
      metadata: await ProductFactory.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
        ...req.body,
      }),
    }).send(res);
  };
  // END QUERY//
}

module.exports = ProductController;
