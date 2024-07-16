import mongoose from 'mongoose';

const ticketCollection = 'tickets';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
});



const ticketSchema = new mongoose.Schema({
    code:  {type: String, unique:true},
    purchase_datetime: String,
    amount: Number,
    purchaser: String,
    // products: [{ type: String }],
    products: [productSchema],
    
},
{
    timestamps: true,

})

const ticketModel = mongoose.model(ticketCollection, ticketSchema);
export default ticketModel;
