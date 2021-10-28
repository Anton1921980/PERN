
const uuid = require( 'uuid' )
const path = require( 'path' )
const { Device, DeviceInfo, Brand, Basket, BasketDevice } = require( '../models/models' )
const ApiError = require( '../error/ApiError' )

class BasketController
{
    async addBasket ( req, res, next )
    {
        try
        {
            let { id } = req.body

            const device = await Basket.create( { id } );
            return res.json( basket )

        } catch ( e )
        {
            next( ApiError.badRequest( e.message ) )
        }

    }
    async getBasket ( req, res )
    {

        let basket;

        basket = await Basket.findAndCountAll()

        return res.json( basket )

    }
}

module.exports = new BasketController()