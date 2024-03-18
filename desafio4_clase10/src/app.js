import express from "express";
import __dirname from './utils.js';
import handlebars from 'express-handlebars'
//import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import viewRoutes from './routes/views.routes.js'; 
import viewSocketsRoutes from './routes/viewsSocket.routes.js';
import { Server } from 'socket.io'; // este server se creara a partir del server http


const app = express();


const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, ()=>{
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





// Ruta Telemetria. Testeando servidor
app.get('/ping', (req,res)=>{
    res.send({ status: 'ok' })
    console.log(__dirname);
})

//* endpoint ruta carrito
app.use('/api/carts/',cartsRoutes)

//* PRODUCTS PARA POSTMAN (comentada para darle lugar al uso de handlebars)
//app.use('/api/products/',productsRoutes)


//* endpoint ruta productos VISTA HANDLEBARS
app.use('/api/products/', viewRoutes)


//* endpoint ruta productos WEBSOCKET
app.use('/realtimeproducts/', viewSocketsRoutes)


