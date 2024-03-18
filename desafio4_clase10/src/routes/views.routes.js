import express  from 'express';
import { ProductManager } from "../ProductManager.js";


const router = express.Router()
let productManager = new ProductManager()


//*HANDLEBARS
router.get('/', async (req,res)=>{
    // esto es lo que vamos a pintar en el handlebar home.handlebars
    let allProducts = await productManager.getProducts()
    res.render('home',{
        title:'desafio 4 con handlebars',
        products: allProducts,
        style: "style.css" 
    })
})


export default router


