import express from "express";
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import __dirname from '../utils.js';




const app = express();

// Middlewares de config.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuracion de archivos estaticos
app.use(express.static(__dirname + '/src/public'))


const PORT = 8080;
app.listen(PORT, ()=>{
    console.log(`Server run on port: ${PORT}`)
})




// Ruta Telemetria. Testeando servidor
app.get('/ping', (req,res)=>{
    res.send({ status: 'ok' })
    console.log(__dirname);
})



//definimos puntos de entrada para LOS ROUTERS
app.use('/api/carts/',cartsRoutes)
app.use('/api/products/',productsRoutes)




