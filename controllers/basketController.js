
const { Device, BasketDevice, Basket } = require( "../models/models" )

class BasketController
{

    async addtoBasket ( req, res, next )
    {
        const user = req.user
        const { deviceId } = req.body
        const basket = await BasketDevice.create( { basketId: user.id, deviceId: deviceId } )
        return res.json( basket )
    }

    async getBasketUser ( req, res )
    {
        const { id } = req.user
        const basket = await BasketDevice.findAll( {
            include: {
                model: Device
            }, where: { basketId: id }
        } )

        return res.json( basket )
    }
    async delfromBasket ( req, res, next )
    {  
        const { id } = req.params
        const basketDevice = await BasketDevice.destroy( {
            where: { id }
        } )

        return res.json( basketDevice )
    }


}








module.exports = new BasketController()