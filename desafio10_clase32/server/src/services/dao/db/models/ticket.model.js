import mongoose from 'mongoose';

const ticketCollection = 'tickets';



const ticketSchema = new mongoose.Schema({
    code:  {type: String, unique:true},
    purchase_datetime: String,
    amount: Number,
    purcharser: String  
    //purchaser: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
},
{
    timestamps: true,

}
)


// ticketSchema.pre('findOne', function(next){
//     this.populate('users')
//     next()
// })



const ticketModel = mongoose.model(ticketCollection, ticketSchema);
export default ticketModel;
