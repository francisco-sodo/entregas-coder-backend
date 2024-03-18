import express  from 'express';


//? Si queremos cambiar de persistencia - solo descomentar/comentar
//*FS
//import { ProductManager } from "../dao/filesystem/ProductManager.js";
//*DB
import  ProductManager  from "../dao/db/ProductManager.js";



const router = express.Router()
let productManager = new ProductManager()


//*HANDLEBARS
router.get('/', async (req,res)=>{
    // esto es lo que vamos a pintar en el handlebar home.handlebars
    let allProducts = await productManager.getProducts()
    res.render('home',{
        title:'desafio 4 con handlebars',
        products: allProducts,
        style: "realTimeProducts.css" 
    })
})


export default router


