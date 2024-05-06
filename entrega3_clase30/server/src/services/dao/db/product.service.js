import { productsModel } from './models/products.model.js';


export default class ProductServiceMongo {
    constructor() {
        //console.log("Working products with Database persistence in mongodb");
    }


    //get
    getAll = async () => {
        try {
            let products = await productsModel.find();
            return products.map(product => product.toObject());
            
        } catch (error) {
            console.error('Error al obtener los productos', error);
            throw error; 
        }
    }

     //get find by name
     getByTitle = async (title) => {
        //const result = await productsModel.findOne({title: title});
        const result = await productsModel.findOne({ title: { $regex: new RegExp(title, 'i') } });
        console.log(":::::::result:::::::")
        console.log(result)
        return result;
    };

      //get find by name
      getByCategory = async (category) => {
        //const result = await productsModel.find({category: category});
        const result = await productsModel.find({category: { $regex: new RegExp(category, 'i') }});
        console.log(":::::::result:::::::")
        console.log(result)
        return result;
    
    };

    //puedo buscar por categoria, por stock, etc


    //get by id
    getById = async (pid) => {
        try {
            let productById = await productsModel.findOne({_id:pid});
            return productById
            
        } catch (error) {
            console.error('Error al buscar un producto por su id:', error);
            throw error; 
        }
    }
   

    //post
    create = async (product) => {
        try {
            let newProduct = await productsModel.create(product);
            return newProduct

        } catch (error) {
            console.error('Error al crear un producto', error);
            throw error; 
        }
    }
    
    //put
    update = async (pid,body) => {
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
    delete = async (pid) => {
        try {
            let deleteProduct = await productsModel.deleteOne({_id:pid});
            return deleteProduct

        } catch (error) {
            console.error('Error al eliminar un producto', error);
            throw error; 
        }
    }







}//fin clase


