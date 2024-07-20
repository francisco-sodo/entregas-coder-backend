import { productsModel } from './models/products.model.js';



export default class ProductServiceMongo {
    constructor() {
    }


    //get
    getAll = async () => {
        try {
            let products = await productsModel.find();
            return products.map(product => product.toObject());
            
        } catch (error) {
            throw Error('Error al obtener los productos', error); 
        }
    }

     //get find by title
     getByTitle = async (title) => {
        const result = await productsModel.find({ title: { $regex: new RegExp(title, 'i') } });
        // console.log(":::::::result:::::::", result)
        return result;
    };

 

      //get find by category
      getByCategory = async (category) => {
        const result = await productsModel.find({category: { $regex: new RegExp(category, 'i') }});
        // console.log(":::::::result:::::::", result)
        return result;
    };

    //get by id
    getById = async (pid) => {
        try {
            let productById = await productsModel.findOne({_id:pid});
            return productById
            
        } catch (error) {
            throw Error('Error al buscar un producto por su id:', error);
        }
    }
   

    //post
    create = async (product) => {
        try {
            let newProduct = await productsModel.create(product);
            // si todo esta ok...
            return newProduct
        } 
        catch (error) {
            throw Error('Error al crear un producto', error);
        }
    }
    
    //put
    update = async (pid,body) => {
        try {
            let updateProduct = await productsModel.findOneAndUpdate(
                { _id: pid },body,{ new: true });
                if(!updateProduct){
                    throw new Error(`Producto con ID ${pid} no encontrado`);
                }
            return updateProduct

        } catch (error) {
            throw Error('Error al modificar un producto', error);
        }
    }
    
    //delete
    delete = async (pid) => {
        try {
            let deleteProduct = await productsModel.deleteOne({_id:pid});
            return deleteProduct

        } catch (error) {
            throw Error('Error al eliminar un producto', error);
        }
    }







}//fin clase


