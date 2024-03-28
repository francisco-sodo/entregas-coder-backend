import { Router } from 'express';


//? Si queremos cambiar de persistencia - solo descomentar/comentar
//*FS
//import { CartManager } from "../dao/filesystem/CartManager.js";
//*DB
import CartManager from "../dao/db/CartManager.js";


let cartManager = new CartManager()

const router = Router()





//? MOSTRAR TODOS LOS CARRITOS
//GET
router.get('/', async (req,res)=>{
    try {
        let carts = await cartManager.getCarts()
        res.json( carts )

    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al obtener los carritos' });
    }
})

//? BUSCAR Y MOSTRAR UN CARRITO POR SU ID MEDIANTE REQ.PARAMS
//GET
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

//? CREAR Y AGREGAR CARRITOS
//POST
router.post('/', async (req,res)=>{
    try {
        let newPost = await cartManager.addCart()
        res.send(newPost);
       
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al agregar un nuevo carrito' });
    }
})



//? CREAR Y AGREGAR PRODUCTOS AL CARRITO SELECCIONADO POR ID
//POST
router.post('/:cid/product/:pid', async (req,res)=>{
    let { cid, pid } = req.params
try {
    let newProductInCart = await cartManager.addNewProductsInCart(cid,pid)
    res.send(newProductInCart)
 
} catch (error) {
    res.status(500).send({ status: 500, error:' Error al agregar un producto a un carrito' });
    
}
})



//? ACTUALIZAR CANTIDAD (quantity) DE PRODUCTO SELECCIONADO EN CARRITO. 
// PUT
router.put('/:cid/product/:pid', async (req,res)=>{
    let { cid, pid } = req.params;
    let {quantity} = req.body;
    // console.log(typeof(quantityUpdate))
    // console.log(quantityUpdate)

    try {

        //todo -->  aca falta verificar si el id del producto a modificar existe. 200/404.

        let newQuantity = await cartManager.updateProductQuantity(cid, pid, quantity);
       
        newQuantity
        ? res.send({ msg: `Se actualizo con exito la cantidad del producto con el ID ${pid}, dentro del carrito con el ID ${cid}`})
        : res.status(404).send({ error:`Producto con el ID ${pid} no fue encontrado en el carrito con el ID ${cid}` })

    } catch (error) {
        console.error('Error al actualizar la cantidad de un producto en este carrito:');
        res.status(500).send({ status: 500, error:' Error al actualizar la cantidad de un producto en este carrito' });
    }
} )


//! ACTUALIZAR PRODUCTOS EN CARRITO SELECCIONADO. 
// PUT
// router.put('/:cid/', async (req,res)=>{
//     let { cid } = req.params
//     let {updateData} = req.body
// try {

//     let existingCart = await cartManager.getCartById(cid);
    
//     if(existingCart){
//         let newProductsInCart = await cartManager.updateProductsInCart(cid, updateData)
//         return res.send({ msg: `El carrito con el ID ${cid} ha sido actualizado con éxito`, payload: newProductsInCart });
//     } else{
//         res.status(404).send({ error:`Carrito con el ID ${cid} no fue encontrado` });
//     }
    
// } catch (error) {
//     console.error('Error al actualizar la cantidad de un producto en este carrito:', error);

//     res.status(500).send({ status: 500, error:' Error al actualizar los productos en el carrito' });
// }
// })






//? VACIAR CARRITO.
// DELETE
router.delete('/:cid', async (req,res)=>{
    let { cid } = req.params
    try {
        let clearedCart = await cartManager.clearCart(cid)
        console.log("ACKNOWLEDGED", clearedCart)

        clearedCart
        ? res.send({ msg: `Carrito con el ID ${cid} vaciado`})
        : res.status(404).send({ error:`Carrito con el ID ${cid} no pudo ser vaciado` });
   
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al querer vaciar un carrito por ID' });
    }
})

//? ELIMINAR 1 PRODUCTO SELECCIONADO DENTRO DE CARRITO. 
// DELETE
router.delete('/:cid/product/:pid', async (req,res)=>{
    let { cid, pid } = req.params
    try {
        let deletedProduct = await cartManager.deleteProductInCart(cid,pid)
        console.log("ACKNOWLEDGED", deletedProduct)

        deletedProduct
        ? res.send({ msg: `Producto con el ID ${pid} eliminado del carrito`})
        : res.status(404).send({ error:`Producto con el ID ${pid} no fue encontrado` });
   
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al querer eliminar un producto de este carrito' });
    }
})









// DELETE PARA ELIMINAR EL CARRITO POR SU ID MEDIANTE REQ.PARAMS (no aplicar)
// router.delete('/:cid', async (req,res)=>{
//     let { cid } = req.params
//     try {
//         let cartId = await cartManager.deleteCart(cid)
//         console.log("ACKNOWLEDGED", cartId)

//         cartId
// /       ? res.send({ msg: `Carrito con el ID ${cid} eliminado`})
//         : res.status(404).send({ error:`Carrito con el ID ${cid} no pudo ser eliminado` });
   
//     } catch (error) {
//         res.status(500).send({ status: 500, error: 'Error al querer eliminar un carrito por ID' });
//     }
// })




export default router;