import { Router } from 'express';
import * as ProductController from '../controllers/products.controller.js';
import { passportCall,authorization} from "../utils.js";


const router = Router()

// GET
router.get('/', ProductController.getAllProducts)

// GET
router.get('/search_title/:title([a-zA-Z%C3%A1%C3%A9%20]+)', ProductController.getProductByTitle)

// GET
router.get('/search_category/:category([a-zA-Z%C3%A1%C3%A9%20]+)', ProductController.getProductByCategory)

// GET
router.get('/:pid', ProductController.getProductById)

// POST
router.post('/', passportCall('jwt'),authorization('admin','premium'),ProductController.createProduct)
//router.post('/',ProductController.createProduct) // to testing

// PUT
router.put('/:pid',passportCall('jwt'),authorization('admin','premium'), ProductController.updateProduct)

// DELETE
router.delete('/:pid', passportCall('jwt'),authorization('admin','premium'), ProductController.deleteProduct)


export default router;