import { cartsModel } from './models/carts.model.js';
import { productService } from '../../service.js';




export default class CartsServiceMongo {
    constructor() {
        //console.log("Working carts with Database persistence in mongodb");
    }


    //get A1
    getAll = async () => {
        try {
            let carts = await cartsModel.find();
            return carts.map(cart => cart.toObject());
                
        } catch (error) {
            console.error('Error al obtener los carritos', error);
            throw error; 
        }
    }


    //get by id A2
    getById = async (cid) => {
        try {
            //let cartById = await cartsModel.findOne({_id:cid});
            let cartById = await cartsModel.findById(cid);
            return cartById
            
        } catch (error) {
            console.error('Error al buscar un carrito por su id:', error);
            throw error; 
        }
    }


    //post A3
    create = async (cart) => {
        
        try {
            let newCart = await cartsModel.create(cart);
            return newCart
            
        } catch (error) {
            console.error('Error al crear un carrito', error);
            throw error;  
        }
    }

    //put prod in cart A4
    //? AGREGAR PRODUCTO AL CARRITO
    update = async (cid, pid) => {
        try {
            let cart = await cartsModel.findOne({_id:cid});
            //let cart = await cartsModel.findById(cid);
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


    
  
    //? ACTUALIZAR CANTIDAD (quantity) DE PRODUCTO SELECCIONADO EN CARRITO. 
    //  mediante updateOne -> $set
    // A5
    updateQuantity = async (cid, pid, quantity) => {

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


    //? ELIMINAR 1 PRODUCTO SELECCIONADO DENTRO DE CARRITO. 
    // eliminar 1 producto seleccionado dentro del carrito mediante updateOne -> $pull
    // A6
    delete = async (cid, pid) => {
        try {
            let deleteProduct = await cartsModel.updateOne({ _id: cid }, { $pull: { products: { product: pid } } });
            return deleteProduct
            
        } catch (error) {
            console.error('Error al eliminar un producto del carrito:', error);
            throw error;
        }
    }

    //? VACIAR CARRITO. 
    // vaciar todo el carrito mediante updateOne -> $set 
    // A7
    clear = async (cid) => {
        try {
            let clearCart = await cartsModel.updateOne({ _id: cid }, { $set: { products: [] } });
            return clearCart
            
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw error;
        }
       
    }




    //? COMPRAR UN PRODUCTO. 
    // comprar 1 producto seleccionado dentro del carrito 
    purchaseProducts = async (cid,pid) => {

        try {
            const cart = await this.getById(cid);
            if (!cart) {
                throw new Error(`Carrito con ID ${cid} no fue encontrado`);
            }

            // Buscar el producto en el carrito
            const productInCart = cart.products.find(p => p.product.equals(pid));
            if (!productInCart) {
                throw new Error(`Producto con ID ${pid} no fue encontrado en el carrito`);
            }

            // Obtener detalles del producto
            const productDetails = await productService.getById(pid);
            if (!productDetails) {
                throw new Error(`Detalles del producto con ID ${pid} no fueron encontrados`);
            }

            // Verificar si hay suficiente stock
            if (productDetails.stock < productInCart.quantity) {
                throw new Error(`No hay suficiente stock del producto con ID ${pid}`);
            }

            // Restar la cantidad comprada del stock del producto
            productDetails.stock -= productInCart.quantity;
            await productDetails.save();

            // Eliminar el producto comprado del carrito
            cart.products = cart.products.filter(p => !p.product.equals(pid));
            await cart.save();

            return {
                product: productDetails,
                quantity: productInCart.quantity,
            };
        } catch (error) {
            console.error('Error al comprar un producto en el carrito:', error);
            throw error;
        }

    }

    



 
} //fin de la clase




