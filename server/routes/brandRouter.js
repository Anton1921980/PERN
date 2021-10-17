const Router = require( 'express' )
const router = new Router()
const brandController = require( '../controllers/brandController' )


router.post( '/', brandController.create )
router.get( '/', brandController.getAll )

//delete 

module.exports = router