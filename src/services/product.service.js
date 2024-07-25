const { product, clothing, electronic } = require("../models/product.model");
const {
  BadRequestError,
  ConflictRequestError,
  NotFoundError,
} = require("../core/error.response");
const { PRODUCT_TYPE } = require("../constants");
class ProductFactory {
  /*
        type: "Clothing, Electronic"
        payload
    */
  static async createProduct(type, payload) {
    switch (type) {
      case PRODUCT_TYPE.Clothing:
        return new Clothings(payload).createProduction();
      case PRODUCT_TYPE.Electronic:
        return new Electronics(payload).createProduction();
      default:
        throw new BadRequestError(`Invalid Product Types`);
    }
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

module.exports = {
  ProductFactory,
};
