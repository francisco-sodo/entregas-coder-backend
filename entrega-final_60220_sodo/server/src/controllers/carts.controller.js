

//*repository
import { cartService, productService, ticketService, userService } from '../services/service.js';
import { sendPurchaseConfirmationEmail } from '../controllers/email.controller.js';





// all carts
export const getAllCarts = async (req, res) => {
    try {
        let carts = await cartService.getAll()
        res.json( carts )

    } catch (error) {
        req.logger.error('500: Error al obtener todos los carritos');
        res.status(500).send({ status: 500, error: 'Error al obtener los carritos' });
    }
}


//get cart by id
export const getCartById = async (req, res) => {
    let { cid } = req.params

    try {
        let cartId = await cartService.getById(cid)
       
        cartId
        ? res.send({ msg: `Carrito con el ID ${cid} encontrado`, cart: cartId})
        : res.status(404).send({ error:`Carrito con el ID ${cid} no fue encontrado` });
    
    } catch (error) {
        req.logger.error('500: Error al obtener los carritos por ID');
        res.status(500).send({ status: 500, error: 'Error al obtener los carritos por ID' });
    }
}

//post cart
export const createCart = async (req, res) => {
   
    try {
        let newPost = await cartService.create()
        res.send(newPost);
    
    } catch (error) {
        req.logger.error('500: Error al agregar un nuevo carrito');
        res.status(500).send({ status: 500, error: 'Error al agregar un nuevo carrito' });
    }
}


// put product in cart
export const updateProductInCart = async (req, res) => {
    let { cid, pid } = req.params

    try {
        let product = await productService.getById(pid);
        if (!product) {
            return res.status(404).send({ msg: `Producto con el ID ${pid} no fue encontrado` });
        }

        // Verificar si el usuario es premium y es el dueño del producto
        if (req.user.role === 'premium' && product.owner === req.user.email) {
            req.logger.warning("No puedes agregar a tu carrito tus propios productos");
            return res.status(403).send({ msg: "No puedes agregar a tu carrito tus propios productos" });
        }

        let newProductInCart = await cartService.update(cid,pid)
        newProductInCart = await cartService.getById(cid)
        res.send({msg:"Se ha agregado el producto al carrito con exito", payload:newProductInCart})
    
    } catch (error) {
        req.logger.error('500: Error al agregar un producto a un carrito');
        res.status(500).send({ status: 500, error:' Error al agregar un producto a un carrito' });  
    }
}


//actualizar cantidad del producto en carrito
export const updateProdQuantInCart = async (req, res) => {
    //patch
    let { cid, pid } = req.params;
    let {quantity} = req.body;
    
    try {
        let newQuantity = await cartService.updateQuantity(cid, pid, quantity);
       
        newQuantity
        ? res.send({ msg: `Se actualizo con exito la cantidad del producto con el ID ${pid}, dentro del carrito con el ID ${cid}`})
        : res.status(404).send({ error:`Producto con el ID ${pid} no fue encontrado en el carrito con el ID ${cid}` })

    } catch (error) {
        req.logger.error('500: Error al actualizar la cantidad de un producto en este carrito:');
        res.status(500).send({ status: 500, error:' Error al actualizar la cantidad de un producto en este carrito' });
    }
}


// delete product in a cart
export const deleteProductInCart = async (req, res) => {
    let { cid, pid } = req.params
    try {
        let deletedProduct = await cartService.delete(cid,pid)
        req.logger.info("ID de Producto eliminado: "+ pid);

        deletedProduct
        ? res.send({ msg: `Producto con el ID ${pid} eliminado del carrito`})
        : res.status(404).send({ error:`Producto con el ID ${pid} no fue encontrado` });
   
    } catch (error) {
        req.logger.error('500: Error al querer eliminar un producto de este carrito');
        res.status(500).send({ status: 500, error: 'Error al querer eliminar un producto de este carrito' });
    }
}


// A7
// vaciar carrito
export const clearCart = async (req, res) => {
    let { cid } = req.params
    try {
        let clearedCart = await cartService.clear(cid)
        
        clearedCart
        ? res.send({ msg: `Carrito con el ID ${cid} vaciado`}) + req.logger.info("ID de carrito Vaciado: " + cid)
        : res.status(404).send({ error:`Carrito con el ID ${cid} no pudo ser vaciado` });
   
    } catch (error) {
        req.logger.error('500: Error al querer vaciar un carrito');
        res.status(500).send({ status: 500, error: 'Error al querer vaciar un carrito por ID' });
    }
}



export const purchaseProductInCart = async (req, res) => {
    let { cid, pid } = req.params;
    try {
        const result = await cartService.purchaseProducts(cid, pid);

        // Generar ticket para el producto comprado
        const user = req.user.email;
        const ticketDetails = {
            amount: result.product.price * result.quantity,
            purchaser: user,
            products: [{ title: result.product.title, quantity: result.quantity }],
        };

        const generatedTicket = await ticketService.generateTicket(ticketDetails);

        // Enviar correo de confirmación de compra
        await sendPurchaseConfirmationEmail(user, generatedTicket);

        res.json({
            msg: `Compra del producto con ID ${pid} realizada con éxito`,
            ticket: generatedTicket,
        });
    } catch (error) {
        req.logger.error('500: Error al comprar el producto en el carrito:'+ error);
        res.status(500).send({ status: 500, error: 'Error al comprar el producto en el carrito' });
    }
};
































