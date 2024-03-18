import express from 'express';
import { ProductManager } from "../dao/filesystem/ProductManager.js";
import { ioServer } from '../app.js'

const socketRouter = express.Router()
let productManager = new ProductManager()





socketRouter.get('/', async (req, res) => {

    //*HANDLEBARS
    //render de todos los productos en realTimeProducts.handlebars
    let allProducts = await productManager.getProducts()
    res.render('realTimeProducts', {
        title: "desafio 4 con websockets",
        products: allProducts,
        style: "realTimeProducts.css"
    });


    //*RUTAS
    // GET peticion del cliente para establecer conexion
    //lo que el back escucha desde el front
    ioServer.on('connection', (socket) => {

        console.log('Nuevo cliente conectado')
        //lo que el back devuelve al front
        socket.on('logMessage', (data) => {
            console.log(data)
            ioServer.emit('status', 'conectado con el Servidor socketServer')
        })

        //! PRODUCT GET DESDE EL BACK
        // peticion del cliente para consultar producto por id
        socket.on('getProduct', async (data) => {
            let productById = await productManager.getProductById(data);
            if (data === "") {
                //si data no me trae ningun id, es porque no pedi buscar por id, y muestro todos los productos
                ioServer.emit('getProduct', {
                    message: "Todos los Productos consultados",
                    products: await productManager.getProducts()
                });
                //si no encuentra el id solicitado
            } else if (!productById.id) {
                ioServer.emit('getProduct', {
                    message: `Producto ${data} no encontrado`,
                    products: await productManager.getProducts()
                });
                //si encuentra el id
            } else {
                ioServer.emit('getProduct', {
                    message: "Consulta exitosa",
                    products: [productById]
                });
            }
        });

        //! PRODUCT POST DESDE EL BACK
        // POST peticion del cliente para agregar producto
        socket.on('addProduct', async (data) => {
            //let addProduct = await productManager.addProduct(JSON.parse(data))
            let addProduct = JSON.parse(data)
            
            // campos obligatorios para agregar producto
            if(!addProduct.title || !addProduct.price || !addProduct.description || !addProduct.code || !addProduct.status || !addProduct.stock || !addProduct.category ){
                ioServer.emit('addProduct', {
                    message: "Debe copletar todos los campos del producto",
                    products: await productManager.getProducts()
                });
                return;
            }

            let allProducts = await productManager.getProducts()
            const uniqueCode = allProducts.some(prod => prod.code === addProduct.code);
            // no debe haber dos code repetidos dentro del array de productos
            if(uniqueCode){
                ioServer.emit('addProduct', {
                    message: 'El codigo ingresado ' + [addProduct.code] + ' ya existe.',
                    products: await productManager.getProducts()
                });  
                return;
            }


          
            await productManager.addProduct(addProduct)
            ioServer.emit('addProduct', {
                message: [addProduct.title] + ' agregado',
                products: await productManager.getProducts()
            });
        });

        //! PRODUCT DELETE DESDE EL BACK
        // DELETE  peticion del cliente para eliminar producto
        socket.on('deleteProduct', async (data) => {
            let deleteProduct = await productManager.deleteProduct(data)

            if (!deleteProduct) {
                ioServer.emit('deleteProduct', {
                    message: `Producto con el id ${data} no encontrado`,
                    products: await productManager.getProducts()
                });

            } else {

                ioServer.emit('deleteProduct', {
                    message: `Producto con el id ${data} eliminado`,
                    products: await productManager.getProducts()
                });
            }
        });


    }); // *FIN DE RUTAS 

});




export default socketRouter