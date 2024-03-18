import { Router } from 'express';


//? Si queremos cambiar de persistencia - solo descomentar/comentar
//*FS
//import { CartManager } from "../dao/filesystem/CartManager.js";
//*DB
import CartManager from "../dao/db/CartManager.js";


let cartManager = new CartManager()

const router = Router()




//? GET PARA MOSTRAR TODOS LOS CARRITOS
router.get('/', async (req,res)=>{
    try {
        let carts = await cartManager.getCarts()
        res.json( carts )

    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al obtener los carritos' });
    }
})

//? GET PARA BUSCAR Y MOSTRAR UN CARRITO POR SU ID MEDIANTE REQ.PARAMS
router.get('/:cid', async (req,res)=>{
    let { cid } = req.params
    try {
        let cartId = await cartManager.getCartById(cid)

        cartId
        ? res.send({ msg: `Carrito con el ID ${cid} encontrado`, cart: cartId })
        : res.status(404).send({ error:`Carrito con el ID ${cid} no fue encontrado` });
   
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al obtener los carritos por ID' });
    }
})

//? POST PARA CREAR Y AGREGAR CARRITOS
router.post('/', async (req,res)=>{
    try {
        let newPost = await cartManager.addCart()
        res.send(newPost);
        // limit???
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al agregar un nuevo carrito' });
    }
})


//? POST PARA CREAR Y AGREGAR PRODUCTOS AL CARRITO SELECCIONADO POR ID
router.post('/:cid/product/:pid', async (req,res)=>{
    let { cid, pid } = req.params
try {
    let newProductInCart = await cartManager.addNewProductsInCart(cid,pid)
    res.send(newProductInCart)
 
} catch (error) {
    res.status(500).send({ status: 500, error:' Error al agregar un producto a un carrito' });
    
}
})






//? DELETE PARA ELIMINAR CARRITO POR SU ID MEDIANTE REQ.PARAMS
router.delete('/:cid', async (req,res)=>{
    let { cid } = req.params
    try {
        let cartId = await cartManager.deleteCart(cid)
        console.log("ACKNOWLEDGED", cartId)

        cartId
        ? res.send({ msg: `Carrito con el ID ${cid} eliminado`})
        : res.status(404).send({ error:`Carrito con el ID ${cid} no pudo ser eliminado` });
   
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al querer eliminar un carrito por ID' });
    }
})

export default router;