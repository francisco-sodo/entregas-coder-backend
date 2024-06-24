//faker
import { generateProduct } from '../utils.js';


import { productService } from '../services/service.js';

//   get
//   http://localhost:8080/mockingproducts/memo/
export const mockingProductsInMemo = async (req,res) => {
    try {
      let products = [];
       // Generar 50 productos
      for (let i = 0; i < 50; i++) {
        products.push(generateProduct());
    }
    res.send({ status: "success", payload: products });
  
      
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se han podido obtener los productos:" });
    }
  
  }


//   post
//   http://localhost:8080/mockingproducts/db/
export const mockingProductsInDB = async (req, res) => {
    try {
        let products = [];
        // Generar 5 productos
        for (let i = 0; i < 3; i++) {
            const product = generateProduct();

                products.push(product);
        }
       
        const createdProducts = await productService.create(products);
        res.send({ status: "success", payload: createdProducts });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se han podido agregar los productos:" });
    }
};