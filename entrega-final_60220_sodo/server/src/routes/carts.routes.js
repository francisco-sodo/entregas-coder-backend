import { Router } from 'express'


import { passportCall,authorization} from "../utils.js";

// importamos todos los metodos de carts controller

import * as CartController from '../controllers/carts.controller.js'



const router = Router()


// GET ALL CARTS
router.get('/', CartController.getAllCarts)

// GET CART BY ID
router.get('/:cid', passportCall('jwt'),authorization('user','premium'), CartController.getCartById)

// POST CART
router.post('/', passportCall('jwt'),authorization('user','premium'), CartController.createCart)

// PUT NEW PRODUCT IN A CART
router.put('/:cid/product/:pid', passportCall('jwt'),authorization('user','premium'), CartController.updateProductInCart)

// PATCH PRODUCT QUANTITY IN A CART
router.patch('/:cid/product/:pid', passportCall('jwt'),authorization('user','premium'), CartController.updateProdQuantInCart)

// DELETE PRODUCT IN A CART
router.delete('/:cid/product/:pid', passportCall('jwt'),authorization('user','premium'), CartController.deleteProductInCart)

// CLEAR CART
router.delete('/:cid', passportCall('jwt'),authorization('user','premium'), CartController.clearCart)


// PURCHASE PRODUCT
router.get('/:cid/purchase', passportCall('jwt'),authorization('user','premium'), CartController.purchaseProduct)




export default router;


