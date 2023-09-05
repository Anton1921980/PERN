const { Brand, TypeBrand } = require("../models/models");
const ApiError = require("../error/ApiError");

class BrandController {
  async create(req, res) {
    const { name } = req.body;
    const brand = await Brand.create({ name });

    return res.json(brand);
  }

  async getAll(req, res) {
    let type_brands;
    let brands;
    let id1;
    let id3;
   
    let { typeId } = req.query;

    if (typeId) {
      type_brands = await TypeBrand.findAll({ where: { typeId } });

      id1 = JSON.parse(JSON.stringify(type_brands));
      id3 = Array.from(id1);
      let id = id3.map((a) => a.brandId);

      brands = await Brand.findAll({ where: { id } });
    } else if (!typeId) {
      brands = await Brand.findAll();
    }

    return res.json(brands);
  }
}

module.exports = new BrandController();
