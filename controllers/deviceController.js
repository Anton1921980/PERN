const uuid = require("uuid");
const path = require("path");
const { Sequelize } = require("../db");
const { Op } = require("sequelize");

const {
  Device,
  DeviceInfo,
  Basket,
  BasketDevice,
  Type,
  Brand,
  TypeBrand,
} = require("../models/models");

const ApiError = require("../error/ApiError");
// const { all } = require("sequelize/types/lib/operators");

class DeviceController {
 
  async create(req, res, next) {
    try {
    
      let { name, price, brandId, typeId, info, img } = req.body;

      let fileName;
      if (!req.body.hasOwnProperty("img")) {
        const { img } = req.files;
        fileName = uuid.v4() + ".jpg"; //create unique filename
        img.mv(path.resolve(__dirname, "..", "static", fileName)); //no folder server/static after deploy?
      }

      let newTypeId;
      let newBrandId;

      if (typeof typeId !== "number") {
        const types = await Type.findAll();

        const typeExist = types.find((type) => type.name === typeId);
        if (typeExist) {
          newTypeId = typeExist.id;
        } else {
          const newType = await Type.create({ name: typeId });
          newTypeId = newType.id;
        }
      }

      if (typeof brandId !== "number") {
        const brands = await Brand.findAll();

        // Check if brandId exists
        const brandExist = brands.find((brand) => brand.name === brandId);

        if (brandExist) {
          newBrandId = brandExist.id;
        } else {
          const newBrand = await Brand.create({ name: brandId });
          newBrandId = newBrand.id;
        }
      }
      // if (typeof newTypeId === "number" && typeof newBrandId === "number") {
      const type_brands = await TypeBrand.findAll({
        where: { typeId: newTypeId, brandId: newBrandId },
      });

      // Check if typeBrandExist exists
      let typeBrandExist = type_brands.find(
        (tb) => tb.typeId === newTypeId && tb.brandId === newBrandId
      );
      if (!typeBrandExist) {
        const typeBrandNew = await TypeBrand.create({
          typeId: newTypeId,
          brandId: newBrandId,
        });

        typeBrandExist = typeBrandNew.id;
      }

      const device = await Device.create({
        name,
        price,
        typeId: newTypeId,
        brandId: newBrandId,
        img: img || fileName,
      });

      // Modify the forEach loop to return an array of promises
      info = JSON.parse(info);

      const deviceInfoPromises = await info.map(async (i) =>
        DeviceInfo.create({
          title: i.title,
          description: i.description,
          deviceId: device.id,
        })
      );

      // Wait for all promises to resolve using Promise.all()
      const deviceInfo = await Promise.all(deviceInfoPromises);

      // Combine the data you want to return into a single object
      const responseData = {
        device: {
          id: device.id,
          name: device.name,
          price: device.price,
          brandId: device.newBrandId, //brandId
          typeId: device.newTypeId, //typeId
          img: device.img || fileName,
        },
        deviceInfo: deviceInfo, // Assuming deviceInfo is an array
      };

      // Send the combined data as a single response
      return res.json(responseData);
      // }
    } catch (e) {
      next("ApiError.badRequest(e.message)", ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    let { typeId, brandId, infoId, page, limit, min, max, sort } = req.query;

    page = page || 1;
    limit = limit || 1000;

    if (sort && sort !== "") {
      sort = [["price", sort]];
    } else {
      sort = [["id", "DESC"]];
    }

    let offset = page * limit - limit;
    let devices;

    let where = {}; // Create an empty object for the 'where' clause

    // Check for the presence of min and max
    if (min && max) {
      where.price = {
        [Op.between]: [min, max],
      };
    }

    if (infoId) {
      //search by device ids so type, brand  not needed
      where.id = infoId;
    } else {
      // Check for the presence of typeId
      if (typeId) {
        where.typeId = typeId;
      }
      // Check for the presence of brandId
      if (brandId) {
        where.brandId = brandId;
      }
    }
    // Use the 'where' object in the query
    devices = await Device.findAndCountAll({
      where,
      limit,
      offset,
      order: sort,
    });

    return res.json(devices);
  }

  async getOne(req, res) {
    const { id, typeId } = req.query;

    let where = {};
    if (id) {
      where.id = id;
    }
    if (typeId) {
      where.typeId = typeId;
    }
    const device = await Device.findOne({
      where,
      include: [{ model: DeviceInfo, as: "info" }],
    });
    return res.json(device);
  }

  async getInfos(req, res) {
    const { ids } = req.query;
    try {
      let where = {};
      if (ids) {
        where.deviceId = {
          [Sequelize.Op.in]: ids.split(",").map(Number),
        };
      }

      const device = await DeviceInfo.findAndCountAll({
        where,
      });
      return res.json(device);
    } catch (error) {
      console.error("Error infos:", error);
      return null;
    }
  }

  async getMinMaxPrices(req, res) {
    let { brandId, typeId } = req.query;

    try {
      const whereClause = {};
      if (typeId) {
        whereClause.typeId = typeId;
      }
      if (brandId) {
        whereClause.brandId = brandId;
      }

      const minmax = await Device.findOne({
        attributes: [
          [Sequelize.fn("min", Sequelize.col("price")), "minPrice"],
          [Sequelize.fn("max", Sequelize.col("price")), "maxPrice"],
        ],
        where: whereClause,
      });

      const minPrice = minmax.getDataValue("minPrice");

      const maxPrice = minmax.getDataValue("maxPrice");

      return res.json([minPrice, maxPrice]);
    } catch (error) {
      console.error("Error fetching min-max prices:", error);
      return null;
    }
  }

  async editOne(req, res) {
    const { id } = req.params;
    let { name, price, brandId, typeId, info } = req.body;
    let fileName;
    if (req.files) {
      const { img } = req.files;
      fileName = uuid.v4() + ".jpg"; 

      img.mv(path.resolve(__dirname, "..", "static", fileName)); 
    }

    const updatedDevice = {};

    if (fileName?.length > 0) {
      updatedDevice.img = fileName;
    }
    if (name?.length > 0) {
      updatedDevice.name = name;
    }
    if (price > 0) {
      updatedDevice.price = price;
    }
    if (brandId > 0) {
      updatedDevice.brandId = brandId;
    }
    if (typeId > 0) {
      updatedDevice.typeId = typeId;
    }

    const device = await Device.update(updatedDevice, { where: { id } });

    const infoParsed = JSON.parse(info);

    const infoNew = infoParsed.filter((i) => i.number);
    const deviceInfoNew = await infoNew.forEach((i) =>
      DeviceInfo.create(
        {
          title: i.title,
          description: i.description,
          deviceId: id, 
        }
        // { where: { id } }
      )
    );
    const infoEdited = infoParsed.filter((i) => !i.number);
    const deviceInfoEdited = await infoEdited.forEach((i) =>
      DeviceInfo.update(
        {
          title: i.title,
          description: i.description,
          deviceId: id, 
        },
        { where: { id: i.id } }
      )
    );

    //DeviceInfo.delete pass id
    const infoDeleted = infoParsed.filter((i) => i.delete == true);

    const deviceInfoDelete = await infoDeleted.forEach((i) =>
      DeviceInfo.destroy({
        where: { id: i.id },
      })
    );
    return res
      .json(device)
      .json(deviceInfoNew)
      .json(deviceInfoEdited)
      .json(deviceInfoDelete);
  }

  async deleteOne(req, res) {
    const { id } = req.params;
    const device = await Device.destroy({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });
    return res.sendStatus(200);
  }

  async sendData(req, res) {
    const data = req.body.data;     
    const getOneResult = require("../getone2.js");
    const result = await getOneResult(data);

    result !== {} && res.json({ result: result });
  }

  async sendAllData(req, res) {
    const data = req.body;
    const getAllResults = require("../get2.js");
    const result = await getAllResults(data);

    result !== {} && res.json({ result: result });
  }
}

module.exports = new DeviceController();
