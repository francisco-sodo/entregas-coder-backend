
import { Router } from 'express';

const messagesRoutes = Router()



messagesRoutes.get('/', async (req, res) => {

    
    res.render('chat', {
        title: "Mensajes",
        chatStyle: "chat.css",
    });
});


export default messagesRoutes