import mongoose from 'mongoose';


const cartsCollection = 'cart';


const cartSchema = new mongoose.Schema({

    

    products: { 
        type: [
            {
                product: {type: mongoose.Schema.Types.ObjectId, ref: "products"},
                quantity: {type: Number, required: true},
            }
        ],
         default:[] 
    }

})

cartSchema.pre('findOne', function(){
    //cartSchema.pre('findById', function(){
    this.populate('products.product')
})


export const cartsModel = mongoose.model(cartsCollection, cartSchema);