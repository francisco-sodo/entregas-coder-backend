import { Router } from 'express';

// importamos todos los metodos de products controller
import {getProductDataControllers, 
        getProductIdDataControllers,
        getProductWordDataControllers,
        postProductDataControllers,
        putProductDataControllers,
        deleteProductDataControllers
 } from '../controllers/products.controller.js'


const router = Router()

// GET
router.get('/', getProductDataControllers)


// GET
router.get('/:word([a-zA-Z%C3%A1%C3%A9%20]+)', getProductWordDataControllers)


// GET
router.get('/:pid', getProductIdDataControllers)


// POST
router.post('/', postProductDataControllers)


// PUT
router.put('/:pid', putProductDataControllers)


// DELETE
router.delete('/:pid', deleteProductDataControllers)




export default router;

