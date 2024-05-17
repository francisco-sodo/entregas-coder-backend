import express from "express";
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import config from './config/config.js'; // configuraciones del archivo config
import MongoSingleton from "./config/mongodb-singleton.js"; // clase para conectarnos a MongoDB con singleton
import cors from 'cors';

import { Server } from 'socket.io'; // este server se creara a partir del server http


//imports passport
import cookieParser from "cookie-parser";
import passport from 'passport';
import initializePassport from './config/passport.config.js'; // esta viene del archivo passport.config

//chat
import chatController from './controllers/chat.controller.js'; // Importar el controlador de chat


const app = express();



/*=============================================
=           importacion de rutas              =
=============================================*/

//cart
//* /api/carts/ 
import cartsRoutes from './routes/carts.routes.js';
//* /carts/ -> VIEW:
import viewCartsRoutes from './routes/view.carts.routes.js'; 

//product
//* /api/products/ 
import productsRoutes from './routes/products.routes.js';
//* /products/ -> VIEW:
import viewProductsRoutes from './routes/view.products.routes.js'; 

//users
//instancia de la herencia del CustomRouter
//* /api/extend/users
import UsersExtendRouter from "./routes/custom/users.extend.routes.js";
const usersExtendRouter = new UsersExtendRouter()
//* /users/  -> VIEW:
import viewUsersRoutes from './routes/view.users.routes.js'

//* user login with Github
import viewGithubLoginRoutes from './routes/view.github-login.routes.js'


//* /api/email/ 
import emailRoutes from './routes/email.routes.js'


//* /chat/ -> DB HB WS
import chatRoutes from './routes/chat.routes.js';

//* /faker/
import fakeProductsRoutes from './routes/fakeProducts.routes.js'





/*=============================================
=        configuracion Middlewares JSON.      =
=============================================*/
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



/*=============================================
=       configuracion Middlewares CORS        =
=============================================*/

app.use(cors()) // CORS sin restricciones



/*=============================================
=      configuracion Middleware de HBS         =
=============================================*/
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views'); 
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));


/*=============================================
=     configuracion Middleware Cookies        =
=============================================*/
//app.use(cookieParser("CoderS3cr3tC0d3"));
app.use(cookieParser(config.cookieParser));


/*=============================================
=     configuracion Middlewares Passport      =
=============================================*/
//inicializo passport y le digo que va a trabajar con sessiones
initializePassport();
app.use(passport.initialize());



/*=============================================
=             Declaración de Routers          =
=============================================*/

//* Ruta Telemetria. Testeando servidor
app.get('/ping', (req,res)=>{
    res.send({ status: 'ok' })
    console.log(__dirname);
})



//* endpoint API CARRITO
app.use('/api/carts/',cartsRoutes)
//* endpoint VISTA CARRITO
app.use('/carts/', viewCartsRoutes)


//* endpoint API PRODUCTOS
app.use('/api/products/',productsRoutes)
//* endpoint VISTA PRODUCTOS
app.use('/products/', viewProductsRoutes)


//* endpoint API USERS
// ruta para ejecutar metodo getRouter(), de CustomRouter 
app.use("/api/extend/users", usersExtendRouter.getRouter())
//* endpoint VISTA USERS
app.use("/user", viewUsersRoutes);
//* endpoint VISTA GITHUB LOGIN USERS
app.use("/github", viewGithubLoginRoutes);


//* endpoint API MAILING
app.use("/api/email", emailRoutes)


//* endpoint ruta chats WEBSOCKET
app.use('/chat/', chatRoutes)

//* endpoint api fake products
app.use('/mockingproducts', fakeProductsRoutes)



/*=============================================
=           declaracion de PORT              =
=============================================*/
const SERVER_PORT = config.port; //dejamos de hardcodear el puerto, porque lo traemos desde config.js
const httpServer = app.listen(SERVER_PORT, () => {
    console.log(`Server run on port: ${SERVER_PORT}`)
})

//creamos un servidor para trabajar con sockets viviendo en nuestro servidor principal
export const ioServer = new Server(httpServer)


/*=============================================
=       connectMongoDB - singleton           =
=============================================*/
// esta configuracion solo se usa si NO estoy usando una factory
// Si lo siguiente esta comentado es porque MongoDB esta siendo iniciado con sigleton desde FACTORY ./services/factory.js

const mongoInstance = async () => {
    try {
        await MongoSingleton.getInstance();
    } catch (error) {
        console.error(error);
        process.exit();
    }
};
mongoInstance();


chatController(ioServer);


