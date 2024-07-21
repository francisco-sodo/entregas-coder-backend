import { Router } from 'express'
import { passportCall,authorization} from "../utils.js";
import * as CartController from '../controllers/carts.controller.js'


const router = Router()


// GET ALL CARTS
router.get('/', CartController.getAllCarts)

// GET CART BY ID
router.get('/:cid', passportCall('jwt'),authorization('user','premium'), CartController.getCartById)

// POST CART
router.post('/', passportCall('jwt'),authorization('user','premium'), CartController.createCart)
// router.post('/', CartController.createCart) // to testing

// PUT NEW PRODUCT IN A CART
router.put('/:cid/product/:pid', passportCall('jwt'),authorization('user','premium'), CartController.updateProductInCart)
// router.put('/:cid/product/:pid', CartController.updateProductInCart) // to testing

// PATCH PRODUCT QUANTITY IN A CART
router.patch('/:cid/product/:pid', passportCall('jwt'),authorization('user','premium'), CartController.updateProdQuantInCart)

// DELETE PRODUCT IN A CART
router.delete('/:cid/product/:pid', passportCall('jwt'),authorization('user','premium'), CartController.deleteProductInCart)
// router.delete('/:cid/product/:pid', CartController.deleteProductInCart) // to testing

// CLEAR CART
router.delete('/:cid', passportCall('jwt'),authorization('user','premium'), CartController.clearCart)

// PURCHASE PRODUCT
router.get('/:cid/product/:pid/purchase', passportCall('jwt'),authorization('user','premium'), CartController.purchaseProductInCart)




export default router;


