import { Router } from 'express';


//? Si queremos cambiar de persistencia - solo descomentar/comentar
//*FS
//import { CartService } from "../services/filesystem/cart.service.js";
//*DB
import CartService from "../services/db/cart.service.js";


let cartService = new CartService()

const router = Router()





//? MOSTRAR TODOS LOS CARRITOS
//GET A1
router.get('/', async (req,res)=>{
    try {
        let carts = await cartService.getCarts()
        res.json( carts )

    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al obtener los carritos' });
    }
})

//? BUSCAR Y MOSTRAR UN CARRITO POR SU ID MEDIANTE REQ.PARAMS
//GET A2
router.get('/:cid', async (req,res)=>{
    let { cid } = req.params
    try {
        let cartId = await cartService.getCartById(cid)
        
        cartId
        ? res.send({ msg: `Carrito con el ID ${cid} encontrado`, cart: cartId })
        : res.status(404).send({ error:`Carrito con el ID ${cid} no fue encontrado` });
   
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al obtener los carritos por ID' });
    }
})

//? CREAR Y AGREGAR CARRITOS
//POST A3
router.post('/', async (req,res)=>{
    try {
        let newPost = await cartService.addCart()
        res.send(newPost);
       
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al agregar un nuevo carrito' });
    }
})




//? MODIFICAR CARRITO. AGREGAR PRODUCTOS (CID) AL CARRITO.
//POST A4
router.put('/:cid/product/:pid', async (req,res)=>{
    let { cid, pid } = req.params
try {
    let newProductInCart = await cartService.addNewProductsInCart(cid,pid)
    res.send(newProductInCart)
 
} catch (error) {
    res.status(500).send({ status: 500, error:' Error al agregar un producto a un carrito' });
    
}
})


//? ACTUALIZAR SOLO CANTIDAD (quantity) DE PRODUCTO SELECCIONADO EN CARRITO. 
// PUT A5
router.patch('/:cid/product/:pid', async (req,res)=>{
    let { cid, pid } = req.params;
    let {quantity} = req.body;
    
    try {
        //todo -->  aca falta verificar si el id del producto a modificar existe. 200/404.

        let newQuantity = await cartService.updateProductQuantity(cid, pid, quantity);
       
        newQuantity
        ? res.send({ msg: `Se actualizo con exito la cantidad del producto con el ID ${pid}, dentro del carrito con el ID ${cid}`})
        : res.status(404).send({ error:`Producto con el ID ${pid} no fue encontrado en el carrito con el ID ${cid}` })

    } catch (error) {
        console.error('Error al actualizar la cantidad de un producto en este carrito:');
        res.status(500).send({ status: 500, error:' Error al actualizar la cantidad de un producto en este carrito' });
    }
} )




//? VACIAR CARRITO.
// DELETE A6
router.delete('/:cid', async (req,res)=>{
    let { cid } = req.params
    try {
        let clearedCart = await cartService.clearCart(cid)
        console.log("ACKNOWLEDGED", clearedCart)

        clearedCart
        ? res.send({ msg: `Carrito con el ID ${cid} vaciado`})
        : res.status(404).send({ error:`Carrito con el ID ${cid} no pudo ser vaciado` });
   
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al querer vaciar un carrito por ID' });
    }
})

//? ELIMINAR 1 PRODUCTO SELECCIONADO DENTRO DE CARRITO. 
// DELETE A7
router.delete('/:cid/product/:pid', async (req,res)=>{
    let { cid, pid } = req.params
    try {
        let deletedProduct = await cartService.deleteProductInCart(cid,pid)
        console.log("ACKNOWLEDGED", deletedProduct)

        deletedProduct
        ? res.send({ msg: `Producto con el ID ${pid} eliminado del carrito`})
        : res.status(404).send({ error:`Producto con el ID ${pid} no fue encontrado` });
   
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al querer eliminar un producto de este carrito' });
    }
})





export default router;