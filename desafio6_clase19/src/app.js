import express from "express";
import __dirname from './utils.js';
import handlebars from 'express-handlebars'


// imports mongo mongoose sessions
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

//imports passport
import passport from 'passport';
import initializePassport from './config/passport.config.js'; // esta viene del archivo passport.config


/*=============================================
=           importacion de rutas              =
=============================================*/

//cart
//* /api/carts/ -> DB 
import cartsRoutes from './routes/carts.routes.js';
//* /carts/ -> DB HB:
import viewCartsRoutes from './routes/view.carts.routes.js'; 

//product
//* /api/products/ -> DB 
import productsRoutes from './routes/products.routes.js';
//* /products/ -> DB HB:
import viewProductsRoutes from './routes/view.products.routes.js'; 


//user session
//* /api/sessions/ -> DB 
import usersSessionsRoutes from './routes/usersSessions.routes.js'
//* /users/  -> DB HB:
import viewUsersSessionsRoutes from './routes/view.usersSessions.routes.js'


const app = express();


/*=============================================
=        configuracion Middlewares JSON.      =
=============================================*/
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/*=============================================
=      configuracion Middleware de HBS         =
=============================================*/
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views'); // Carpeta views. Aca van a estar las plantillas de HB
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));//Indicamos que vamos a trabajar con archivos estaticos en carpeta public para alojar css, js..


const URL_MONGO = 'mongodb+srv://fanky1986:LOmyNfS0kmmTHZZ4@cluster0.ptjuvdn.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0'


/*=============================================
=     configuracion Middleware Sessions        =
=============================================*/
app.use(session({
    store: MongoStore.create({
        mongoUrl: URL_MONGO,
        ttl: 10*30
    }),
    secret: "fran$3cr3t",
    resave: false, //guarda en memoria
    saveUninitialized: true, //lo guarda apenas se crea
}));


/*=============================================
=     configuracion Middlewares Passport      =
=============================================*/
//inicializo passport y le digo que va a trabajar con sessiones
initializePassport();
app.use(passport.initialize());
app.use(passport.session());




/*=============================================
=             Declaración de Routers          =
=============================================*/

//* Ruta Telemetria. Testeando servidor
app.get('/ping', (req,res)=>{
    res.send({ status: 'ok' })
    console.log(__dirname);
})

//* endpoint ruta carrito (HB no implementado - API)
app.use('/api/carts/',cartsRoutes)

//* endpoint ruta carrito VISTA HANDLEBARS
app.use('/carts/', viewCartsRoutes)


//* endpoint ruta productos (HB no implementado - API)
app.use('/api/products/',productsRoutes)

//* endpoint ruta productos VISTA HANDLEBARS
app.use('/products/', viewProductsRoutes)


//* endpoint ruta user sessions (HB no implementado - API)
app.use("/api/sessions", usersSessionsRoutes);

//* endpoint ruta user sessions VISTA HANDLEBARS
app.use("/users", viewUsersSessionsRoutes);




/*=============================================
=           declaracion de PORT              =
=============================================*/
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`)
})

/*=============================================
=             connectMongoDB                  =
=============================================*/
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




