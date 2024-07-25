"use strict";
const { ObjectId } = require("mongoose").Types;
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const {
  BadRequestError,
  ConflictRequestError,
  NotFoundError,
} = require("../core/error.response");
const { PRODUCT_TYPE } = require("../constants");
const {
  findAllDraftsForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
} = require("../models/repositories/product.repo");
class ProductFactory {
  /*
        type: "Clothing, Electronic"
        payload
    */
  static registeredProduction = {};

  static registerProduct(type, classRef) {
    ProductFactory.registeredProduction[type] = classRef;
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactory.registeredProduction[type];
    if (!productClass) throw new BadRequestError(`Invalid Product Types`);

    return new productClass(payload).createProduction();
  }

  static async searchProductByUser({ keyword }) {
    return await searchProductByUser(keyword);
  }

  static async findAllDraftsForShop({ product_shop, skip = 0, limit = 50 }) {
    const query = {
      product_shop: new ObjectId(product_shop),
      isDraft: true,
    };
    return await findAllDraftsForShop({ query, skip, limit });
  }

  static async findAllPublishedForShop({ product_shop, skip = 0, limit = 50 }) {
    const query = {
      product_shop: new ObjectId(product_shop),
      isPublished: true,
    };
    return await findAllPublishedForShop({ query, skip, limit });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_id, product_shop });
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_id, product_shop });
  }
}

class Product {
  // Class Product chứa những thuộc tính chung
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  async createProduct(product_shop) {
    return await product.create({ ...this, _id: product_shop });
  }
}

class Electronics extends Product {
  async createProduction() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new production error");
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new production error");
    return newProduct;
  }
}

class Clothings extends Product {
  async createProduction() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create new production error");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create new production error");
    return newProduct;
  }
}

class Furnitures extends Product {
  async createProduction() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Create new production error");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create new production error");
    return newProduct;
  }
}

ProductFactory.registerProduct("Electronics", Electronics);
ProductFactory.registerProduct("Clothings", Clothings);
ProductFactory.registerProduct("Furnitures", Furnitures);

module.exports = {
  ProductFactory,
};
