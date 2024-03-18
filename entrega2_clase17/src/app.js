import express from "express";
import __dirname from './utils.js';
import handlebars from 'express-handlebars'
import mongoose from 'mongoose';



//RUTAS IMPORTADAS

//* /api/carts/ -> DB 
import cartsRoutes from './routes/carts.routes.js';

//* /api/products/ -> DB 
import productsRoutes from './routes/products.routes.js';



//* /products/ -> DB HB:
import viewProductsRoutes from './routes/viewProducts.routes.js'; 

//* /carts/ -> DB HB:
import viewCartsRoutes from './routes/viewCarts.routes.js'; 




const app = express();


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`)
})



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
app.use('/products/', viewProductsRoutes)

//* endpoint ruta carrito VISTA HANDLEBARS
app.use('/carts/', viewCartsRoutes)





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




