//si se trabaja con repository, comentar factory

//factory
//import { cartService } from '../services/factory.js'

//repository
//import { userService } from '../services/service.js';
import { cartService } from '../services/service.js';




//get A1
//? MOSTRAR TODOS LOS CARRITOS
export const getAllCarts = async (req, res) => {
    try {
        let carts = await cartService.getAll()
        res.json( carts )

    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al obtener los carritos' });
    }
}


//get by id A2
//? BUSCAR Y MOSTRAR UN CARRITO POR SU ID
export const getCartById = async (req, res) => {
    let { cid } = req.params
   
  
    try {
        let cartId = await cartService.getById(cid)
       

        cartId
        ? res.send({ msg: `Carrito con el ID ${cid} encontrado`, cart: cartId})
        : res.status(404).send({ error:`Carrito con el ID ${cid} no fue encontrado` });
   
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al obtener los carritos por ID' });
    }
}

//post A3
//? CREAR CARRITOS
export const createCart = async (req, res) => {
    try {
        let newPost = await cartService.create()
        res.send(newPost);
       
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al agregar un nuevo carrito' });
    }
}

//put prod in cart A4
//? AGREGAR PRODUCTOS (CID) AL CARRITO.
export const updateProductInCart = async (req, res) => {
    let { cid, pid } = req.params
    try {
        let newProductInCart = await cartService.update(cid,pid)
        res.send(newProductInCart)
    
    } catch (error) {
        res.status(500).send({ status: 500, error:' Error al agregar un producto a un carrito' });  
    }
}

// A5
//? ACTUALIZAR SOLO CANTIDAD (quantity) DE PRODUCTO SELECCIONADO EN CARRITO. 
export const updateProdQuantInCart = async (req, res) => {
    //patch
    let { cid, pid } = req.params;
    let {quantity} = req.body;
    
    try {
        //todo -->  aca falta verificar si el id del producto a modificar existe. 200/404.

        let newQuantity = await cartService.updateQuantity(cid, pid, quantity);
       
        newQuantity
        ? res.send({ msg: `Se actualizo con exito la cantidad del producto con el ID ${pid}, dentro del carrito con el ID ${cid}`})
        : res.status(404).send({ error:`Producto con el ID ${pid} no fue encontrado en el carrito con el ID ${cid}` })

    } catch (error) {
        console.error('Error al actualizar la cantidad de un producto en este carrito:');
        res.status(500).send({ status: 500, error:' Error al actualizar la cantidad de un producto en este carrito' });
    }
}


// A6
//? ELIMINAR 1 PRODUCTO SELECCIONADO DENTRO DE CARRITO. 
export const deleteProductInCart = async (req, res) => {
    let { cid, pid } = req.params
    try {
        let deletedProduct = await cartService.delete(cid,pid)
        console.log("ACKNOWLEDGED", deletedProduct)

        deletedProduct
        ? res.send({ msg: `Producto con el ID ${pid} eliminado del carrito`})
        : res.status(404).send({ error:`Producto con el ID ${pid} no fue encontrado` });
   
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al querer eliminar un producto de este carrito' });
    }
}


// A7
//? VACIAR CARRITO.
export const clearCart = async (req, res) => {
    let { cid } = req.params
    try {
        let clearedCart = await cartService.clear(cid)
        console.log("ACKNOWLEDGED", clearedCart)

        clearedCart
        ? res.send({ msg: `Carrito con el ID ${cid} vaciado`})
        : res.status(404).send({ error:`Carrito con el ID ${cid} no pudo ser vaciado` });
   
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al querer vaciar un carrito por ID' });
    }
}



// A8
//todo FINALIZAR COMPRA PRODUCTO.
export const purchaseProductInCart = async (req, res) => {
    let { cid, pid } = req.params
    let {quantity} = req.body;
    try {
        let purchaseProd = await cartService.purchase(cid,pid,quantity)
        //console.log("ACKNOWLEDGED", purchaseProd)

        purchaseProd
        ? res.send({ msg: `Producto con el ID ${pid} fue comprado con exito`})
        : res.status(404).send({ error:`Producto con el ID ${pid} no pudo ser comprado` });
   
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al querer finalizar la compra del producto' });
    }
}



//!
export const addToCart = async (req, res) => {
    try {
        // Obtiene el ID del usuario desde la solicitud (suponiendo que esté disponible)
        const uid = req.user._id;

        // Obtiene el ID del producto que se va a agregar al carrito desde la solicitud
        const pid = req.body.productId;

        // Agrega el producto al carrito del usuario
        const result = await cartService.addToCart(uid, pid);
        console.log(":::RESULT ADD TO CART" + result)

        res.sendSuccess({ message: 'Producto agregado al carrito exitosamente' });
    } catch (error) {
        console.error(error);
        res.sendInternalServerError({ error: 'Error al agregar producto al carrito' });
    }
};











