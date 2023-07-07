const Router = require( 'express' )
const router = new Router()
const deviceController = require( '../controllers/deviceController' )

const checkRole = require('../middleware/checkRoleMiddleware')


router.post( '/', checkRole('ADMIN'),deviceController.create )
// router.post( '/', deviceController.create )
router.get( '/', deviceController.getAll )
router.get( '/:id', deviceController.getOne )
router.put( '/edit/:id', deviceController.editOne )
router.delete( '/delete/:id', deviceController.deleteOne )

module.exports = router