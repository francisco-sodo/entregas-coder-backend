//si se trabaja con repository, comentar factory

//factory
//import { cartService } from '../services/factory.js'

//repository
//import { userService } from '../services/service.js';
import { cartService, productService, ticketService } from '../services/service.js';




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
        newProductInCart = await cartService.getById(cid)
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
//? FINALIZAR COMPRA.


export const purchaseProduct = async (req, res) => {
    let { cid } = req.params
    
   
    try {
        // Obtener el carrito por su ID
        const cart = await cartService.getById(cid);
      
        if (!cart) {
            return res.status(404).send({ error: `El carrito con el ID ${cid} no fue encontrado` });
        }


        // Iterar sobre los productos del carrito para finalizar la compra
        const productsPurchased = [];
        const productsNotPurchased = [];

        for (const product of cart.products) {
            // Obtener el producto de la base de datos por su ID
            const productDetails = await productService.getById(product.product);
            if (!productDetails) {
                productsNotPurchased.push(product.product);
                continue;
            }
            // Verificar si hay suficiente stock del producto
            if (productDetails.stock >= product.quantity) {
                // Restar la cantidad comprada del stock del producto
                productDetails.stock -= product.quantity;
                await productDetails.save();
                // Agregar el producto a la lista de productos comprados
                productsPurchased.push(product.product);
            } else {
                // Agregar el producto a la lista de productos que no pudieron ser comprados
                productsNotPurchased.push(product.product);
            }
        }


        // calcular total de compra
        const calculateTotalAmount = async (cart) => {
            let totalAmount = 0;
            try {
                for (const product of cart.products) {
                    // Obtener los detalles del producto de la base de datos por su ID
                    const productDetails = await productService.getById(product.product);
                    if (!productDetails) {
                        // Manejar el caso donde los detalles del producto no se encuentran
                        continue;
                    }
                    // Agregar el precio del producto multiplicado por la cantidad al totalAmount
                    totalAmount += productDetails.price * product.quantity;
                }
            } catch (error) {
                console.error('Error al calcular el monto total de la compra:', error);
                // Si hay un error al calcular el monto, puedes retornar 0 o manejarlo de otra forma según tu lógica de negocio
                return 0;
            }
            return totalAmount;
        };



        //Generar ticket con los detalles de la compra
        let user = req.user.email
        const ticketDetails = {
            amount: await calculateTotalAmount(cart),
            purchaser: user,
        };
        const generatedTicket = await ticketService.generateTicket(ticketDetails);
        console.log("Ticket de Compra generado:\n", generatedTicket)

        // Actualizar el carrito para contener solo los productos que no se pudieron comprar
        cart.products = cart.products.filter(product => !productsPurchased.includes(product.product));
        await cart.save();

          // Enviar respuesta al cliente con los productos comprados, los que no pudieron ser comprados y el ticket generado
          res.send({
            purchased: productsPurchased,
            notPurchased: productsNotPurchased,
            ticket: generatedTicket,
        });
        

    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al querer finalizar la compra del producto' });
    }
}
























