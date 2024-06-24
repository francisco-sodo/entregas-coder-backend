import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const productsCollection = 'products';

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    unique: false,
    required: false
};

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    //unique: false,
    required: true
};




const productSchema = new mongoose.Schema({

    title: {type: String, unique:false, required:true},
    description: stringTypeSchemaNonUniqueRequired,
    code: stringTypeSchemaUniqueRequired,
    price: {type: Number, required:true},
    status: {type: Boolean, required:true},
    stock: {type: Number, required:true},
    category: {type: String, unique:false,required:true},
    thumbnails: {type: Array, required:false}
    

})


productSchema.plugin(mongoosePaginate);
export const productsModel = mongoose.model(productsCollection, productSchema);