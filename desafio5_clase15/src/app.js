import express from "express";
import __dirname from './utils.js';
import handlebars from 'express-handlebars'
import mongoose from 'mongoose';
import { Server } from 'socket.io'; // este server se creara a partir del server http


//RUTAS IMPORTADAS

//* /api/carts/ -> DB 
import cartsRoutes from './routes/carts.routes.js';

//* /api/products/ -> DB 
import productsRoutes from './routes/products.routes.js';

//* /api/products/ -> FS HB:
//import viewRoutes from './routes/views.routes.js'; 

//* /realtimeproducts/ -> FS HB WS:
//import viewSocketsRoutes from './routes/viewsSocket.routes.js';

//* /messages/ -> DB HB WS
import messagesRoutes from './routes/messages.routes.js';




const app = express();


const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`)
})

//creamos un servidor para trabajar con sockets viviendo en nuestro servidor principal
export const ioServer = new Server(httpServer)

// Middlewares de config.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// configuracion de HBS
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views'); // Carpeta views. Aca van a estar las plantillas de HB
app.use(express.static(__dirname + '/public'));//Indicamos que vamos a trabajar con archivos estaticos en carpeta public para alojar css, js..




//Declaración de Routers:

//* Ruta Telemetria. Testeando servidor
app.get('/ping', (req,res)=>{
    res.send({ status: 'ok' })
    console.log(__dirname);
})

//* endpoint ruta carrito (HB no implementado)
app.use('/api/carts/',cartsRoutes)


//* endpoint ruta productos (HB no implementado)
app.use('/api/products/',productsRoutes)


//* endpoint ruta productos VISTA HANDLEBARS
//app.use('/api/products/', viewRoutes)

//* endpoint ruta productos WEBSOCKET & HANDLEBARS
//app.use('/realtimeproducts/', viewSocketsRoutes)


//* endpoint ruta messages WEBSOCKET & HANDLEBARS
app.use('/messages/', messagesRoutes)



const URL_MONGO = 'mongodb+srv://fanky1986:LOmyNfS0kmmTHZZ4@cluster0.ptjuvdn.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0'
const connectMongoDB = async () => {
    try {
        await mongoose.connect(URL_MONGO);
        console.log("Conectado con exito a MongoDB usando Moongose.");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};
connectMongoDB();







// /*===================================================================
//? =  logica de ws para CHAT endpoint /messages = DB HB WS
// ====================================================================*/

//*DB
import MessageManager from "../src/dao/db/MessageManager.js";
let messageManager = new MessageManager()


ioServer.on('connection', async socket => {
    // El usuario que se conecte puede ver todos los mensajes existentes
    socket.emit('messageLogs', await messageManager.getAll());

    // guardar mensajes en la db y mostrarlos a todos los usuarios
    socket.on('message', async data => {
        await messageManager.save(data);
        ioServer.emit('messageLogs', await messageManager.getAll());
    });

    // Hacer broadcast del nuevo usuario que se conecta al chat
    socket.on('userConnected', data => {
        // console.log(data);
        socket.broadcast.emit('userConnected', data.user);
    });

    // Cerrar la conexión con un usuario en particular
    socket.on('closeChat', data => {
        if (data.close === "close") socket.disconnect();
        socket.broadcast.emit('closeMsg', data.user);
    });


});
