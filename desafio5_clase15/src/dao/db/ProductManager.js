import { productsModel } from './models/products.js';


export default class ProductManager {
    constructor() {
        console.log("Working products with Database persistence in mongodb");
    }


    //get
    getProducts = async () => {
        try {
            let products = await productsModel.find();
            return products.map(product => product.toObject());
            
        } catch (error) {
            console.error('Error al obtener los productos', error);
            throw error; 
        }
    }

    //get by id
    getProductById = async (_id) => {
        try {
            let productById = await productsModel.find({_id});
            return productById
            
        } catch (error) {
            console.error('Error al buscar un producto por su id:', error);
            throw error; 
        }
    }
    //post
    addProduct = async (product) => {
        try {
            let newProduct = await productsModel.create(product);
            return newProduct

        } catch (error) {
            console.error('Error al crear un producto', error);
            throw error; 
        }
    }
    
    //put
    updateProduct = async (pid,body) => {
        try {
            let updateProduct = await productsModel.findOneAndUpdate(
                { _id: pid },
                body,
                { new: true });
                if(!updateProduct){
                    throw new Error(`Producto con ID ${pid} no encontrado`);
                }
            return updateProduct

        } catch (error) {
            console.error('Error al modificar un producto', error);
            throw error; 
        }
    }
    
    //delete
    deleteProduct = async (_id) => {
        try {
            let deleteProduct = await productsModel.deleteOne({_id});
            return deleteProduct

        } catch (error) {
            console.error('Error al eliminar un producto', error);
            throw error; 
        }
    }
  

}