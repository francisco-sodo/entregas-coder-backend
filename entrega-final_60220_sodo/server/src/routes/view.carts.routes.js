import { Router } from 'express';
import { passportCall,authorization} from "../utils.js";
import { cartService } from '../services/service.js';

const router = Router()




router.get('/:cid', passportCall('jwt'),authorization('user','premium'), async (req,res)=>{
    
    let user = req.user
    let cid = user.cart._id


    
    try {
        const cart = await cartService.getById(cid);
        if (!cart) {
            res.status(404).send({ status: 404, error: 'No se encontró el carrito' });
            return;
        }

        res.render('cart', {
            title: "Vista | Carrito",
            cid: cid,
            owner: user.name,
            styleCart: "styleCart.css",
            products: cart.products.map(item => ({
                pid: item.product._id,
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