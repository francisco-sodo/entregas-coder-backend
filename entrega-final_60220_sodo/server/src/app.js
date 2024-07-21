import express from "express";
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import config from './config/config.js';
import MongoSingleton from "./config/mongodb-singleton.js";
import cors from 'cors';

import { Server } from 'socket.io';

// documentacion de apis
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

//imports passport
import cookieParser from "cookie-parser";
import passport from 'passport';
import initializePassport from './config/passport.config.js'; 

//chat
import chatController from './controllers/chat.controller.js'; 

// logger
import { addLogger } from './config/logger.js';




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
=          middleware loggers nivel app       =
=============================================*/
app.use(addLogger);


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
    //console.log(__dirname);
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

const SERVER_PORT = process.env.PORT || config.port;

const httpServer = app.listen(SERVER_PORT, () => {
    console.log(`SERVER RUN ON PORT: ${SERVER_PORT}`)
})

//servidor para trabajar con sockets viviendo en nuestro servidor principal
export const ioServer = new Server(httpServer)


/*=============================================
=    config swagger (documentacion APIs)      =
=============================================*/
const swaggerOptions = {
    definition: {
        openapi:"3.0.1",
        info: {
            title: "Documentacion de API Coder e-commerce",
            description: "Esta Documentacion utiliza Swagger"
        }
    },
    apis:[`./src/docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))



/*=============================================
=       connectMongoDB - singleton           =
=============================================*/
const mongoInstance = async () => {
    try {
        await MongoSingleton.getInstance();
    } catch (error) {
        //console.error(error);
        process.exit();
    }
};
mongoInstance();


chatController(ioServer);


