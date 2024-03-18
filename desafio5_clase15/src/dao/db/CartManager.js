import { cartsModel } from './models/carts.js';
// import ProductManager from '../db/ProductManager.js';
// let allProductsManagerDB = new ProductManager()


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
    

    // //put
    // updateCart = async ({_id},body) => {
    //     let updateCart = await cartsModel.updateOne({_id},body);
    //     return updateCart
    // }



    //delete
    deleteCart = async (_id) => {
        let deletecart = await cartsModel.deleteOne({_id});
        return deletecart
    }
  

} //fin de la clase