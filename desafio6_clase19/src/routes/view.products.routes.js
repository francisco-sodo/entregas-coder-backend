import { Router } from 'express';


//? Si queremos cambiar de persistencia - solo descomentar/comentar
//*FS
//import { ProductManager } from "../dao/filesystem/ProductManager.js";
//*DB
import  ProductManager  from "../dao/db/ProductManager.js";
import { productsModel } from '../dao/db/models/products.model.js';




let productManager = new ProductManager()
const router = Router()



//*PAGINATION con HB. VISTA DE TODOS LOS PRODUCTOS
// EJ: http://localhost:8080/products?page=1
router.get('/', async (req,res)=>{
    let page = parseInt(req.query.page);
    if(!page) page = 1;
    
    
    try {
        let result = await productsModel.paginate({},{page, limit:6, lean:true })
        
        result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
        result.isValid = !(page < 1 || page > result.totalPages)
        
        
       res.render('products', {
           title: "Vista | Productos",
           styleProds: "styleProducts.css",
           user: req.session.user,
           products: result.docs,
           totalDocs: result.totalDocs,
           currentPage: result.page,
           totalPages: result.totalPages,
           prevLink: result.prevLink,
           nextLink: result.nextLink,
           isValid: result.isValid
        })
        
        console.log(result)
    
        
    } catch (error) {
        console.error("Error al obtener productos paginados:", error);
        res.status(500).send("Error interno del servidor");
    }
})


//* VISTA DE UN SOLO PRODUCTO
//EJ: http://localhost:8080/products/product/65f39b4e3942d59690fbe26f

router.get('/product/:pid', async (req,res)=>{

    let { pid } = req.params;
   

    try {
        let product = await productManager.getProductById(pid);
        if (!product) {
            res.status(404).send({ status: 404, error: 'No se encontró el producto' });
            return;
        }
        // res.send(product)
        res.render('product', {
            title: "Vista | Producto",
            product: product.map(item => ({
                title: item.title,
                price: item.price,
                description: item.description,
                code: item.code,
                status: item.status,
                stock: item.stock,
                category: item.category,
                thumbnails: item.thumbnails
            }))
        });
       
    } catch (error) {
        console.error('Error al obtener el producto por su ID:', error);
        res.status(500).send({ status: 500, error: 'Error al obtener el producto por su ID' });
    }

})





export default router;


