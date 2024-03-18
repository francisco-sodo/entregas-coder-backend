import mongoose from 'mongoose';


const productsCollection = 'products';

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    unique: false,
    required: false
};

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
};

const stringTypeSchemaNonUniqueRequiredIndex = {
    type: String,
    unique: false,
    required: true,
    index:true
};


const productSchema = new mongoose.Schema({

    title: stringTypeSchemaNonUniqueRequiredIndex,
    description: stringTypeSchemaNonUniqueRequired,
    code: stringTypeSchemaUniqueRequired,
    price: {type: Number, required: true},
    status: {type: Boolean, required: true},
    stock: {type: Number, required: true},
    category: stringTypeSchemaNonUniqueRequiredIndex,
    thumbnails: {type: Array, required: false}

})



export const productsModel = mongoose.model(productsCollection, productSchema);