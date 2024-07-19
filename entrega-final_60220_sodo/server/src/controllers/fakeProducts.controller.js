//faker
import { generateProduct } from '../utils.js';
import { productService } from '../services/service.js';
import userModel from '../services/dao/db/models/user.model.js';




//   post
//   http://localhost:8080/mockingproducts/db/
export const mockingProductsInDB = async (req, res) => {

    try {
        let products = [];

        let owner;
        if (req.user && (req.user.role === 'premium' || req.user.role === 'admin')) {
            owner = req.user.email;
        } else {
            // Si no hay un usuario autenticado válido, asignar el email del admin por defecto
            const adminUser = await userModel.findOne({ role: 'admin' });
            if (adminUser) {
                owner = adminUser.email;
            } else {
                throw new Error("Admin user no encontrado");
            }
        }

        // Generar productos
        for (let i = 0; i < 10; i++) {
            const product = generateProduct(owner);

                products.push(product);
        }
       
        const createdProducts = await productService.create(products);
        res.send({ status: "success", payload: createdProducts });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se han podido agregar los productos:" });
    }
};


