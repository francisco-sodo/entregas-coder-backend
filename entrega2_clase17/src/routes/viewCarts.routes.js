

import { Router } from 'express';


//? Si queremos cambiar de persistencia - solo descomentar/comentar
//*FS
//import { CartManager } from "../dao/filesystem/CartManager.js";
//*DB
import CartManager from "../dao/db/CartManager.js";



let cartManager = new CartManager()

const router = Router()




//? BUSCAR Y MOSTRAR UN CARRITO POR SU ID MEDIANTE REQ.PARAMS
//GET
// router.get('/:cid', async (req,res)=>{
//     let { cid } = req.params
//     try {
//         let cart = await cartManager.getCartById(cid)
//         let products = cart.products
    
//       //res.json(products)
//         res.render('cart', {
            
//             title: "Vista | Carrito",
//             _id: cid,
//             cart:cart,
//             products:products
            
//          })

//          console.log("CARRO",cart)
        
//     } catch (error) {
//         res.status(500).send({ status: 500, error: 'Error al obtener los carritos por ID' });
//     }
// })



router.get('/:cid', async (req,res)=>{
    let { cid } = req.params;
    try {
        let cart = await cartManager.getCartById(cid);
        if (!cart) {
            res.status(404).send({ status: 404, error: 'No se encontró el carrito' });
            return;
        }

        res.render('cart', {
            title: "Vista | Carrito",
            _id: cid,
            styleCart: "styleCart.css",
            products: cart.products.map(item => ({
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                thumbnails: item.product.thumbnails
            }))
        });
       
    } catch (error) {
        console.error('Error al obtener el carrito por su ID:', error);
        res.status(500).send({ status: 500, error: 'Error al obtener el carrito por su ID' });
    }
});



























export default router;