import mongoose from 'mongoose';


const chatsCollection = 'chats';


const chatSchema = new mongoose.Schema({
   
   
    user: {type: String, required: true, unique: false, index: false},
    message: {type: String, required: true},
    
    

})



export const chatModel = mongoose.model(chatsCollection, chatSchema);