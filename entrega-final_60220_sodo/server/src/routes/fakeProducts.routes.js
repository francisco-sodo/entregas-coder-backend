import { Router } from "express";
import { passportCall,authorization} from "../utils.js";
import { mockingProductsInDB } from '../controllers/fakeProducts.controller.js';

const router = Router();

// POST 
router.post('/db', passportCall('jwt'),authorization('admin','premium'),mockingProductsInDB)


export default router;



