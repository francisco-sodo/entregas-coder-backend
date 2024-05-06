import { cartsModel } from './models/carts.model.js';



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
            let cartById = await cartsModel.findOne({_id:cid});
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
    update = async (cid, pid) => {
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
            console.error('Error al vaciar el carrito:', error);
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



    //todo FINALIZAR COMPRA PRODUCTO. 
    // A8
    purchase = async (cid,pid,quantity) => {
        try {
            
            
        } catch (error) {
            console.error('Error al querer finalizar la compra:', error);
            throw error;
        }
       
    }




    //!
    //? AGREGAR PRODUCTO AL CARRITO DEL USUARIO
    //A9
    addToCart = async (uid, pid) => {
        try {
          // Obtener el carrito del usuario
          let cart = await cartsModel.findOne({ user: uid });
    
          // Si el usuario no tiene un carrito, crear uno nuevo
          if (!cart) {
            cart = await cartsModel.create({ user: uid, products: [pid] });
          } else {
            // Agregar el producto al carrito existente del usuario
            cart.products.push(pid);
            await cart.save();
          }
        } catch (error) {
          throw new Error("Error al agregar producto al carrito");
        }
      };



} //fin de la clase




