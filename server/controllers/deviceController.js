
const uuid = require( 'uuid' )
const path = require( 'path' )
const { Device, DeviceInfo, Basket, BasketDevice } = require( '../models/models' )
const ApiError = require( '../error/ApiError' )


class DeviceController //для парсера
{
    async create ( req, res, next )
    {
        try
        {
            let { name, price, brandId, typeId, img, info } = req.body
            console.log( "TCL: req", req )

            const device = await Device.create( { name, price, brandId, typeId, img } )
            info = JSON.parse( info )
            const deviceInfo = await info.forEach( i => DeviceInfo.create( {
                title: i.title,
                description: i.description,
                deviceId: device.id//не успевает получать надо .then или await
            } )
            )
            console.log( 'deviceInfo', deviceInfo )
            return (
                res.json( device ).json( deviceInfo )
                // .then(//because res.json calls 2 times get not critical error: 'Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client'
                    // res.json( deviceInfo ) )
            )

        } catch ( e )
        {
            next( ApiError.badRequest( e.message ) )
        }
    }

        async getAll ( req, res )
        {
            let { brandId, typeId, limit, page } = req.query;
            page = page || 1
            limit = limit || 1000
    
            let offset = page * limit - limit
            let devices;
            if ( !brandId && !typeId )
            {
                devices = await Device.findAndCountAll( { limit, offset } )
            }
            if ( brandId && !typeId )
            {
                devices = await Device.findAndCountAll( { where: { brandId }, limit, offset } )
            }
            if ( !brandId && typeId )
            {
                devices = await Device.findAndCountAll( { where: { typeId }, limit, offset } )
            }
            if ( brandId && typeId )
            {
                devices = await Device.findAndCountAll( { where: { typeId, brandId }, limit, offset } )
            }
    
    
            return res.json( devices )
    
    
        }
        async getOne ( req, res )
        {
            const { id } = req.params
            const device = await Device.findOne(
                {
                    where: { id },
                    include: [ { model: DeviceInfo, as: 'info' } ]
                }
            )
            return res.json( device )
        }
    }
    






// class DeviceController_old //для админки
// {
//     async create ( req, res, next )
//     {
//         try
//         {
//             let { name, price, brandId, typeId, info } = req.body
//             console.log("TCL: req", req)

//             const { img } = req.files
//             let fileName = uuid.v4() + ".jpg" //создаем уникальное имя запишется в базу

//             // console.log( "TCL: fileName", fileName )

//             img.mv( path.resolve( __dirname, '..', 'static', fileName ) )//папка на сервере server/static

//             console.log( 'info', info )

//             const device = await Device.create( { name, price, brandId, typeId, img: fileName } )
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
//             )

//         } catch ( e )
//         {
//             next( ApiError.badRequest( e.message ) )
//         }

//     }

//     async getAll ( req, res )
//     {
//         let { brandId, typeId, limit, page } = req.query;
//         page = page || 1
//         limit = limit || 1000

//         let offset = page * limit - limit
//         let devices;
//         if ( !brandId && !typeId )
//         {
//             devices = await Device.findAndCountAll( { limit, offset } )
//         }
//         if ( brandId && !typeId )
//         {
//             devices = await Device.findAndCountAll( { where: { brandId }, limit, offset } )
//         }
//         if ( !brandId && typeId )
//         {
//             devices = await Device.findAndCountAll( { where: { typeId }, limit, offset } )
//         }
//         if ( brandId && typeId )
//         {
//             devices = await Device.findAndCountAll( { where: { typeId, brandId }, limit, offset } )
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

module.exports = new DeviceController()