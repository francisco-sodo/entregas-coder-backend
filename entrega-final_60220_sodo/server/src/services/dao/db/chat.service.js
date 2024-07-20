// LADO DEL SERVIDOR
// LADO DEL CLIENTE EN /public/js/chat.js


import {chatModel} from './models/chat.model.js' 




export default class ChatService {
    constructor() {
    }

    getAll = async () => {
        let messages = await chatModel.find();
        //console.log(messages)
        return messages.map(msg => msg.toObject());
    }

    save = async (msg) => {
        let newMessage = await chatModel.create(msg);
        //console.log(newMessage)
        return newMessage
    }

} // finde la clase





