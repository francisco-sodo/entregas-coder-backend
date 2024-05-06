

import { Router } from 'express';


import { cartService } from '../services/factory.js';

const router = Router()




//? BUSCAR Y MOSTRAR UN CARRITO POR SU ID MEDIANTE REQ.PARAMS
//GET

router.get('/:cid', async (req,res)=>{
    let { cid } = (req.params);
    cid = cid.toString()
    console.log("TIPO DE DATO:::::::::" + typeof(cid))
    try {
        let cart = await cartService.getById(cid);
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