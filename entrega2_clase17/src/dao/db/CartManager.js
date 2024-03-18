import { cartsModel } from './models/carts.js';



export default class CartManager {
    constructor() {
        console.log("Working carts with Database persistence in mongodb");
    }


    //get
    getCarts = async () => {
        try {
            let carts = await cartsModel.find();
            return carts.map(cart => cart.toObject());
                
        } catch (error) {
            console.error('Error al obtener los carritos', error);
            throw error; 
        }
    }


    //get by id
    getCartById = async (_id) => {
        try {
            let cartById = await cartsModel.findOne({_id});
            return cartById
            
        } catch (error) {
            console.error('Error al buscar un carrito por su id:', error);
            throw error; 
        }
    }


    //post
    addCart = async (cart) => {
        try {
            let newCart = await cartsModel.create(cart);
            return newCart
            
        } catch (error) {
            console.error('Error al crear un carrito', error);
            throw error;  
        }
        
      
    }

    //post prod in cart
    addNewProductsInCart = async (cid, pid) => {
        try {
            let cart = await cartsModel.findById(cid);
            if (!cart) {
                throw new Error(`Carrito con ID ${cid} no encontrado`);
            }
    
            // Buscamos el producto en el carrito por su ID único
            let productIndex = cart.products.findIndex(product => product.product.equals(pid));
            if (productIndex !== -1) {
                // Si el producto ya existe en el carrito, incrementamos la cantidad
                cart.products[productIndex].quantity++;
            } else {
                // Si el producto no existe en el carrito, lo agregamos con cantidad 1
                cart.products.push({ product: pid, quantity: 1 });
            }
    
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al agregar un producto al carrito:', error);
            throw error;
        }
    }


    //! ACTUALIZAR PRODUCTOS EN CARRITO SELECCIONADO. 
    // REEMPLAZAR productos en carrito seleccionado mediante save
    updateProductsInCart = async (cid, updateData) => {
        try {
            let cart = await cartsModel.findById(cid); // localizar carrito
            console.log("11111",cart)
            if(!cart ){
                throw new Error(`Carrito con ID ${cid} no encontrado`);
        }

        // Obtener los productos actuales del carrito
        let currentProducts = cart.products;
        console.log("22222",currentProducts)
        // Obtener los nuevos productos o actualizaciones del cuerpo de la solicitud. Lo que viene de req.body en postman
        //! no puedo traer la data que viene del body en postman
        let updateProducts = updateData;
        console.log("33333",updateProducts)
        // Combinar los productos actuales con los nuevos productos o actualizaciones
        
        // Actualizar los productos en el carrito
        

        // Guardar los cambios en la base de datos
        await cart.save();

        return cart;
        } catch (error) {
            console.error("No se pudo actualizar el carrito con los nuevos productos", error)
            throw error;
        }
    }


    //? ACTUALIZAR CANTIDAD (quantity) DE PRODUCTO SELECCIONADO EN CARRITO. 
    // actualizar quantity de producto seleccionado en carrito mediante updateOne -> $set
    updateProductQuantity = async (cid, pid, quantity) => {

     try {
            let newProdQuantity = await cartsModel.updateOne(
                { _id: cid, 'products.product': pid },
                {$set: { 'products.$.quantity': quantity }} );
            return newProdQuantity
            
        } catch (error) {
            console.error('Error al modificar la cantidad de un producto en este carrito:', error);
            throw error;
        }
    
    }



    //? VACIAR CARRITO. 
    // vaciar todo el carrito mediante updateOne -> $set
    clearCart = async (cid) => {
        try {
            let clearCart = await cartsModel.updateOne({ _id: cid }, { $set: { products: [] } });
            return clearCart
            
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw error;
        }
       
    }

    //? ELIMINAR 1 PRODUCTO SELECCIONADO DENTRO DE CARRITO. 
    // eliminar 1 producto seleccionado dentro del carrito mediante updateOne -> $pull
    deleteProductInCart = async (cid, pid) => {
        try {
            let deleteProduct = await cartsModel.updateOne({ _id: cid }, { $pull: { products: { product: pid } } });
            return deleteProduct
            
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw error;
        }
    }



// ELIMINAR CARRITO. (NO APLICAR)
    // deleteCart = async (_id) => {
    //     let deletecart = await cartsModel.deleteOne({_id});
    //     return deletecart
    // }
  

} //fin de la clase


//todo / PUT api/carts/:cid
//? actualizar TODO el carrito con un producto. Debe recibir como body todo el arreglo de productos que queremos actualizar

//todo / PUT api/carts/:cid/products/:pid
//? Debe actualizar SOLO LA CANTIDAD (quantity) que corresponda a dicho producto. La cantidad se la pasamos desde el req.body. El body que voy a enviar debe ser el producto como tal. Hacerlo desde su router. 