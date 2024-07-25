"use strict";
const { ObjectId } = require("mongoose").Types;
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../product.model");

const findAllDraftsForShop = async ({ query, skip, limit }) => {
  return await queryProduct({ query, skip, limit });
};
const findAllPublishedForShop = async ({ query, skip, limit }) => {
  return await queryProduct({ query, skip, limit });
};

const searchProductByUser = async (keyword) => {
  const regexSearch = new RegExp(keyword);
  const results = await product
    .find(
      {
        isDraft: false,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};

const publishProductByShop = async ({ product_id, product_shop }) => {
  return product
    .findOne({
      _id: new ObjectId(product_id),
      product_shop: new ObjectId(product_shop),
    })
    .then((document) => {
      document.isDraft = false;
      document.isPublished = true;
      return document.save();
    });
};

const unPublishProductByShop = async ({ product_id, product_shop }) => {
  return product
    .findOne({
      _id: new ObjectId(product_id),
      product_shop: new ObjectId(product_shop),
    })
    .then((document) => {
      document.isDraft = true;
      document.isPublished = false;
      return document.save();
    });
};

const queryProduct = async ({ query, skip, limit }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 }) //Lấy document mới nhất
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  unPublishProductByShop,
  searchProductByUser,
};
