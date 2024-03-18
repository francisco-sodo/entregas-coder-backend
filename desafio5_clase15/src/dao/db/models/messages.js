import mongoose from 'mongoose';


const messagesCollection = 'messages';


const messageSchema = new mongoose.Schema({
   
   
    user: {type: String, required: true, unique: false, index: false},
    message: {type: String, required: true},
    
    

})



export const messagesModel = mongoose.model(messagesCollection, messageSchema);