
import { Router } from 'express';
import { passportCall,authorization} from "../utils.js";
const chatRoutes = Router()



chatRoutes.get('/', passportCall('jwt'),authorization('user'), async (req, res) => {

    
    res.render('chat', {
        title: "Mensajes",
        chatStyle: "StyleChat.css",
    });
});


export default chatRoutes