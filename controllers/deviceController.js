const uuid = require("uuid");
const path = require("path");
const { Op } = require("sequelize");

const {
  Device,
  DeviceInfo,
  Basket,
  BasketDevice,
} = require("../models/models");
const ApiError = require("../error/ApiError");

class DeviceController {
  //для админки
  async create(req, res, next) {
    try {
      // if (process.env.NODE_ENV === "production") {
      let { name, price, brandId, typeId, info, img } = req.body;
      console.log("TCL: req", req.body);
      console.log("hasOwnProperty: ", req.body.hasOwnProperty("img"));
      let fileName;
      if (!req.body.hasOwnProperty("img")) {
        const { img } = req.files;
        fileName = uuid.v4() + ".jpg"; //создаем уникальное имя запишется в базу
        console.log("fileName: ", fileName);

        img.mv(path.resolve(__dirname, "..", "static", fileName)); //папка на сервере server/static уже нет server после deploy

        console.log("info", info);
      }
      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: img || fileName,
      });

      info = JSON.parse(info);
      const deviceInfo = await info.forEach((i) =>
        DeviceInfo.create({
          title: i.title,
          description: i.description,
          deviceId: device.id, //не успевает получать надо .then или await
        })
      );
      console.log("deviceInfo", deviceInfo);
      return res.json(device).json(deviceInfo);
      // } //parser
      // else {
      //   let { name, price, brandId, typeId, img, info } = req.body;
      //   console.log("TCL: req", req);

      //   const device = await Device.create({
      //     name,
      //     price,
      //     brandId,
      //     typeId,
      //     img,
      //   });
      //   info = JSON.parse(info);
      //   const deviceInfo = await info.forEach((i) =>
      //     DeviceInfo.create({
      //       title: i.title,
      //       description: i.description,
      //       deviceId: device.id, //не успевает получать надо .then или await
      //     })
      //   );
      //   console.log("deviceInfo", deviceInfo);
      //   return res.json(device).json(deviceInfo);
      //   // .then(//because res.json calls 2 times get not critical error: 'Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client'
      //   // res.json( deviceInfo ) )
      // }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    let { typeId, brandId, page, sort, limit, min, max } = req.query;
    console.log("req.query: ", req.query);

  
    page = page || 1;
    limit = limit || 1000;
  
    console.log("TCL sort", sort);
  
    if (sort && sort !== "") {
      sort = [["price sort", sort]];
    } else {
      sort = [["id", "DESC"]];
    }
  
    let offset = page * limit - limit;
    let devices;
  
    let where = {}; // Create an empty object for the 'where' clause

    // Check for the presence of min and max
    if (min || max) {
      where.price = {
        [Op.between]: [min, max],
      };
    }  
    // Check for the presence of typeId
    if (typeId) {
      where.typeId = typeId;
    }  
    // Check for the presence of brandId
    if (brandId) {
      where.brandId = brandId;
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
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });
    return res.json(device);
  }

  async editOne(req, res) {
    const { id } = req.params;
    let { name, price, brandId, typeId, info } = req.body;
    let fileName;
    if (req.files) {
      const { img } = req.files;
      fileName = uuid.v4() + ".jpg"; //создаем уникальное имя запишется в базу
      // console.log( "TCL: fileName", fileName )
      img.mv(path.resolve(__dirname, "..", "static", fileName)); //папка на сервере server/static уже нет server после deploy
      console.log("info", info);
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
    console.log("updatedDevice: ", updatedDevice);

    const device = await Device.update(updatedDevice, { where: { id } });
    console.log("device id: ", device.id);

    const infoParsed = JSON.parse(info);
    console.log("infoParsed: ", infoParsed);
    const infoNew = infoParsed.filter((i) => i.number);
    const deviceInfoNew = await infoNew.forEach((i) =>
      DeviceInfo.create(
        {
          title: i.title,
          description: i.description,
          deviceId: id, //не успевает получать надо .then или await
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
          deviceId: id, //не успевает получать надо .then или await
        },
        { where: { id: i.id } }
      )
    );
    console.log("deviceInfo", deviceInfoNew);

    //DeviceInfo.delete передавати сюди айдішнік
    const infoDeleted = infoParsed.filter((i) => i.delete==true);
    console.log("infoDeleted: ", infoDeleted);
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
}

// class DeviceController //для парсера
// {
//     async create ( req, res, next )
//     {
//         try
//         {
//             let { name, price, brandId, typeId, img, info } = req.body
//             console.log( "TCL: req", req )

//             const device = await Device.create( { name, price, brandId, typeId, img } )
//             info = JSON.parse( info )
//             const deviceInfo = await info.forEach( i => DeviceInfo.create( {
//                 title: i.title,
//                 description: i.description,
//                 deviceId: device.id//не успевает получать надо .then или await
//             } )
//             )
//             console.log( 'deviceInfo', deviceInfo )
//             return (
//                 res.json( device ).json( deviceInfo )
//                 // .then(//because res.json calls 2 times get not critical error: 'Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client'
//                 // res.json( deviceInfo ) )
//             )

//         } catch ( e )
//         {
//             next( ApiError.badRequest( e.message ) )
//         }
//     }

//     async getAll ( req, res )
//     {
//         let { brandId, typeId, limit, page, sort } = req.query;

//         page = page || 1
//         limit = limit || 1000

//         console.log( 'TCL sort', sort )

//         if ( sort && ( sort !== '' ) )
//         {
//             sort = [ [ 'price', sort ] ]
//         }
//         else
//         {
//             sort = [ [ 'id', 'ASC' ] ]
//         }

//         let offset = page * limit - limit
//         let devices;
//         if ( !brandId && !typeId )
//         {
//             devices = await Device.findAndCountAll( { limit, offset, order: sort } )
//         }
//         if ( brandId && !typeId )
//         {
//             devices = await Device.findAndCountAll( { where: { brandId }, limit, offset, order: sort } )
//         }
//         if ( !brandId && typeId )
//         {
//             devices = await Device.findAndCountAll( { where: { typeId }, limit, offset, order: sort } )
//         }
//         if ( brandId && typeId )
//         {
//             devices = await Device.findAndCountAll( { where: { typeId, brandId }, limit, offset, order: sort } )
//         }

//         return res.json( devices )

//     }
//     async getOne ( req, res )
//     {
//         const { id } = req.params
//         const device = await Device.findOne(
//             {
//                 where: { id },
//                 include: [ { model: DeviceInfo, as: 'info' } ]
//             }
//         )
//         return res.json( device )
//     }
// }

module.exports = new DeviceController();
