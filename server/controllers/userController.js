const ApiError = require( '../error/ApiError' )

class UserController
{
    async registration ( req, res )
    {

    }
    async login ( req, res )
    {

    }
    async check ( req, res, next )
    {
        const query = req.query
       
        const { id } = req.query
        console.log("TCL: id", id)
        
        if ( !id )
        {
            console.log("не ид")
            return next( ApiError.badRequest( 'не задан id' ) )
        }
        res.json( id )
    }


}

module.exports = new UserController()