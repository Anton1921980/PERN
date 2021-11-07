const Router = require( 'express' )
const router = new Router()


const basketController = require( '../controllers/basketController' )

// Добавил проверку на авторизацию для того, чтобы вытащить оттуда авторизованного юзера 
const authMiddleware = require( '../middleware/authMiddleware' )


router.get( '/', authMiddleware, basketController.getBasketUser )
router.post( '/', authMiddleware, basketController.addtoBasket )
router.delete( '/:id', authMiddleware, basketController.delfromBasket )

// router.delete( '/basket/:id', authMiddleware, async ( req, res ) =>
// {
//     try
//     {
//         const { id } = req.params;
//         const deleteTodo = await db.query( `DELETE FROM basket_devices WHERE id =${ id } `, [
//             id
//         ] );
//         res.json( "device was deleted!" );
//     } catch ( err )
//     {
//         console.log( err.message );
//     }
// } 
// );

module.exports = router