import express from "express";
import {ProductManager} from "./ProductManager.js";
let productManager = new ProductManager()



const app = express();
// Mideldware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const PORT = 8080;
app.listen(PORT, ()=>{
    console.log(`Server run on port: ${PORT}`)
})


//? GET PARA MOSTRAR TODOS LOS PRODUCTOS Y...
//? GET PARA MOSTRAR UN LIMITE DE PRODUCTOS MEDIANTE REQ.QUERY
app.get('/products', async (req,res)=>{

    let products = await productManager.getProducts()

    let limit = parseInt(req.query.limit)

    try {
        let productLimit = products.slice(0,limit)
        // si no se pone un limite, se muestran todos los productos.
        !limit ? res.json({ products }) : 
        res.send({ msg:`Estas viendo ${limit} de ${products.length} productos`, productLimit}) 
        
    } catch (error) {
        console.log('!!!!!!!!!!!!!!!! ' + error)
        return res.status(500).send({ status: "500", error: "DISCULPAS, HEMOS DETECTADO PROBLEMAS EN EL SERVIDOR", return: 'Link para volver' })
    }
})


//? GET PARA BUSCAR Y MOSTRAR UN PRODUCTO POR SU ID MEDIANTE REQ.PARAMS
app.get('/products/:pid', async (req,res)=>{

    let { pid } = req.params

    try {
        let products = await productManager.getProducts()
        const productId = await products.find(prod => prod.id === parseInt(pid))//recorriendo array para buscar id y parsearlo. Si no lo encuentra, manda msg
        productId ? res.json({ productId }) : 
        res.status(202).send({ status: 'info', msg:` El ID solicidto ${pid} no existe` })
     

    } catch (error) {
        console.log('!!!!!!!!!!!!!!!! ' + error)
        return res.status(500).send({ status: "500", error: "DISCULPAS, HEMOS DETECTADO PROBLEMAS EN EL SERVIDOR", return: 'Link para volver' })
    }
    
})








