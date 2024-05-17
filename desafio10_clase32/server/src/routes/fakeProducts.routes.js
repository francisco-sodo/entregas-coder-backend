import { Router } from "express";
import { passportCall,authorization} from "../utils.js";
import { mockingProductsInMemo, mockingProductsInDB } from '../controllers/fakeProducts.controller.js';


const router = Router();


// POST 
router.get('/memo',mockingProductsInMemo)

// POST 
router.post('/db', passportCall('jwt'),authorization('admin'),mockingProductsInDB)


export default router;



