const { Brand, TypeBrand } = require( '../models/models' )
const ApiError = require( '../error/ApiError' )

class BrandController
{
    async create ( req, res )
    {
        const { name } = req.body
        const brand = await Brand.create( { name } )

        return res.json( brand )
    }

    async getAll ( req, res )
    {
        let type_brands
        let brands
        let id
        let id1
        let id2
        let id3
        // brands = await Brand.findAll()

        let { typeId } = req.query;
        console.log( "TCL: typeId", typeId )
        

        if ( typeId )
        {
            type_brands = await TypeBrand.findAll( { where: { typeId } } )

            id1 = JSON.parse( JSON.stringify( type_brands ) )

            console.log( "TCL: id1", id1 )

            id3 = Array.from( id1 )

            let id = id3.map( a => a.brandId );

            console.log( "TCL: id", id )//[3,4]


            brands = await Brand.findAll( { where: { id } } ) //без await ошибка


        } else if ( !typeId  )
        {
            brands = await Brand.findAll()
        }

        return res.json( brands )
    }
}

module.exports = new BrandController()