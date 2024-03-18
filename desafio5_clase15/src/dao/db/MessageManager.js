//? LADO DEL SERVIDOR
// LADO DEL CLIENTE EN /public/js/chat.js


import { messagesModel } from './models/messages.js' 




export default class MessageManager {
    constructor() {
        console.log("Working messages with Database persistence in mongodb");
    }

    getAll = async () => {
        let messages = await messagesModel.find();
        //console.log(messages)
        return messages.map(msg => msg.toObject());
    }

    save = async (msg) => {
        let newMessage = await messagesModel.create(msg);
        //console.log(newMessage)
        return newMessage
    }

} // finde la clase






