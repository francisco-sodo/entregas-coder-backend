import { Router } from 'express';


//? Si queremos cambiar de persistencia - solo descomentar/comentar
//*FS
//import { ProductManager } from "../dao/filesystem/ProductManager.js";
//*DB
import  ProductManager  from "../dao/db/ProductManager.js";




let productManager = new ProductManager()
const router = Router()



//? GET PARA MOSTRAR TODOS LOS PRODUCTOS Y...
//? GET PARA MOSTRAR UN LIMITE DE PRODUCTOS MEDIANTE REQ.QUERY
router.get('/', async (req, res) => {
    
    try {
        let products = await productManager.getProducts()
        let quantProducts = products.length;
        

        let limit = parseInt(req.query.limit)

        if (!isNaN(limit) && limit > 0) {
            // Verificar si el límite es mayor que el total de productos
            if (limit > quantProducts) {
                return res.status(400).json({ error: `El límite debe ser igual o menor a la cantidad de productos`, cantidad_productos:`${quantProducts}`});
            }
            products = products.slice(0, limit);
            res.json({ msg: `Estas viendo ${products.length} de ${quantProducts} productos`, products: products });
        } else{
            res.json(products)
        }

        
    } catch (error) {
        res.status(500).send({ status: 500, error:' No se pueden mostrar los productos' }); 
    }

})



//? GET PARA BUSCAR Y MOSTRAR UN PRODUCTO POR SU ID MEDIANTE REQ.PARAMS
router.get('/:pid', async (req, res) => {

    let { pid } = req.params
    try {
        let idProduct = await productManager.getProductById(pid)
        idProduct
            ? res.send({ msg: `El Producto con el ID: ${pid} fue encontrado`, Product: idProduct })
            : res.send({ error: `El Producto con el ID: ${pid} no fue encontrado:(` })

    } catch (error) {
        res.status(500).send({ status: 500, error:' Error al querer mostrar un producto por ID' }); 
    }
    
})

//? POST PARA AGREGAR UN PRODUCTO MEDIANTE REQ.BODY
router.post('/', async (req, res) => {
    let newProduct = req.body
    try {
        let newPost = await productManager.addProduct(newProduct)
        newPost
            ? res.json(newPost)
            : res.status(404).send({ error:`El Producto con el ID ${pid} no pudo agregarse correctamente` })

    } catch (error) {
        res.status(500).send({ status: 500, error: `El codigo del producto ingresado ya existe.`, msg:' Error al querer agregar un producto' });
    }
})


//? PUT PARA EDITAR UN PRODUCTO MEDIANTE REQ.BODY Y REQ.PARAMS
router.put('/:pid', async (req,res)=>{
    let { pid }  = req.params
    let productUpdate = req.body

    try {
        let updated = await productManager.updateProduct(pid, productUpdate)
        res.send({ msg: `Producto con el ID ${pid} fue modificado`, product: updated })
        
    } catch (error) {
        res.status(500).send({ status: 500, error:' Error al querer editar un producto' });
    }
})


//? DELETE PARA ELIMINAR UN PRODUCTO MEDIANTE SU ID POR REQ.PARAMS
router.delete('/:pid', async (req, res) => {

    let { pid } = req.params

    try {
        let idProduct = await productManager.deleteProduct(pid)
        console.log("ACKNOWLEDGED", idProduct)
        idProduct
            ? res.send({ msg: `Producto con el ID ${pid} fue eliminado correctamente` })
            : res.send({ msg: `Producto No encontrado` })

    } catch (error) {
        res.status(500).send({ status: 500, error:' Error al eliminar un producto' });
    }
})






export default router;



