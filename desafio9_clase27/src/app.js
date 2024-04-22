import express from "express";
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import config from './config/config.js'; // configuraciones del archivo config


import mongoose from 'mongoose';

//imports passport
import cookieParser from "cookie-parser";
import passport from 'passport';
import initializePassport from './config/passport.config.js'; // esta viene del archivo passport.config




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





/*=============================================
=        configuracion Middlewares JSON.      =
=============================================*/
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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




/*=============================================
=           declaracion de PORT              =
=============================================*/
const SERVER_PORT = config.port; //dejamos de hardcodear el puerto, porque lo traemos desde config.js
app.listen(SERVER_PORT, () => {
    console.log(`Server run on port: ${SERVER_PORT}`)
})

/*=============================================
=             connectMongoDB                  =
=============================================*/
const connectMongoDB = async () => {
    try {
        await mongoose.connect(config.mongoUrl);
        console.log("Conectado con exito a MongoDB usando Moongose.");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};
connectMongoDB();




