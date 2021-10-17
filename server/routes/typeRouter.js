const Router = require( 'express' )
const router = new Router()
const typeController = require( '../controllers/typeController' )


router.post( '/', typeController.create )
router.get( '/', typeController.getAll )

//delete 

module.exports = router