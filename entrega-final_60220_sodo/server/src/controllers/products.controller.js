
//*repository
import { productService } from '../services/service.js';
import userModel from '../services/dao/db/models/user.model.js';

// errors handler
import CustomError from '../services/errors/CustomError.js';
import EErrors from "../services/errors/errors-enum.js";
import { generateProductErrorInfoESP , generateProductErrorInfoENG} from "../services/errors/messages/product-creation-error-messages.js";





export const getAllProducts = async (req, res) => {
  try {
    let products = await productService.getAll();
    let quantProducts = products.length;

    let limit = parseInt(req.query.limit);

    if (!isNaN(limit) && limit > 0) {
      // Verificar si el límite es mayor que el total de productos
      if (limit > quantProducts) {
        req.logger.warning("El límite debe ser igual o menor a la cantidad de productos");

        return res
          .status(400).send({
            error: `El límite debe ser igual o menor a la cantidad de productos`,
            cantidad_productos: `${quantProducts}`,
          });
      }
      products = products.slice(0, limit);
      res.send({
        msg: `Estas viendo ${products.length} de ${quantProducts} productos`,
        products: products,
      });
    } else {
      res.send(products);
    }
  } catch (error) {
    req.logger.error("500: No se pueden mostrar los productos");
    res.status(500).send({ status: 500, error: " No se pueden mostrar los productos" });
  }
};



export const getProductById = async (req, res) => {
  let { pid } = req.params;
  try {
    let idProduct = await productService.getById(pid);
    idProduct
      ? res.send({
          msg: `El Producto con el ID: ${pid} fue encontrado`,
          Product: idProduct,
        })
      : res.send({
          error: `El Producto con el ID: ${pid} no fue encontrado:(`,
        });
  } catch (error) {
    req.logger.error("500: Error al querer mostrar un producto por ID");
    res.status(500).send({ status: 500, error: "Error al querer mostrar un producto por ID"});
  }
};

export const getProductByTitle = async (req, res) => {
  let title = req.params.title;
  
  try {
    let queryProduct = await productService.getByTitle(title);

    if (!queryProduct) {
      res.status(404).send({ message: "No se ha encontrado el Producto" });
      throw new Error("No se ha encontrado el Producto");

    } else {
      res.json(queryProduct);
    }
  } catch(error) {
    req.logger.error("500: Error al querer mostrar un producto por /:title");
    res.status(500).send({status: 500, error: " Error al querer mostrar un producto por /:title"});
  }
};


export const getProductByCategory = async (req, res) => {
  let category = req.params.category;
  try {
    let queryProduct = await productService.getByCategory(category);

    if (!queryProduct) {
      res.status(404).send({ message: "No se ha encontrado el Producto por categoria" });
      throw new Error("No se ha encontrado el Producto por categoria");
    } else {
      res.json(queryProduct);
    }
  } catch (error) {
    req.logger.error("500: Error al querer mostrar un producto por /:category");
    res.status(500).send({ status: 500, error: " Error al querer mostrar un producto por /:category"});
  }
};




export const createProduct = async (req, res) => {
  let newProduct = req.body
  let productTitle = req.body.title;
  let productPrice = req.body.price;

  try {
   
     //? error handler
     if(!productTitle || !productPrice){
     
      CustomError.createError({
          name:"Product creation Error",
          cause:generateProductErrorInfoESP({productTitle,productPrice}),
          message:"Error tratando de crear un producto.",
          code: EErrors.INVALID_TYPES_ERROR
      })
  }


    // Asignar el owner (email del usuario) al producto
    if (req.user && (req.user.role === 'premium' || req.user.role === 'admin')) {
      newProduct.owner = req.user.email; // Asigna el email del usuario como owner
      
  } else {
      // Si no hay un usuario autenticado válido, asignar al admin por defecto
      const adminUser = await userModel.findOne({ role: 'admin' });
      if (adminUser) {
          newProduct.owner = adminUser.email;
          
      } else {
          throw new Error("Admin user no encontrado");
      }
  }

    const code = generateUniqueCode()
    newProduct.code = code

    let newPost = await productService.create(newProduct);

    res.json(newPost)
    req.logger.info("Producto creado exitosamente");


    } catch (error) {
      req.logger.error(error.message);
      res.status(500).send({ error: error.code, message: error.message });
    }
};


// funcion para código único
const generateUniqueCode = () => {
  const randomNumber = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  const randomLetter = String.fromCharCode(
    Math.floor(Math.random() * (90 - 65 + 1)) + 65
  );
  const codeGenerated = randomNumber +'-'+ randomLetter
  return codeGenerated.toString(); 
};






export const updateProduct = async (req, res) => {
  let { pid } = req.params;
  let productUpdate = req.body;

  try {
    let updated = await productService.update(pid, productUpdate);
    res.send({
      msg: `Producto con el ID ${pid} fue modificado`,
      product: updated,
    });
  } catch (error) {
    req.logger.error("500: Error al querer editar un producto");
    res.status(500).send({ status: 500, error: " Error al querer editar un producto" });
  }
};




export const deleteProduct = async (req, res) => {
  let { pid } = req.params;

  try {

    let product = await productService.getById(pid);
    if (!product) {
      return res.status(404).send({ msg: `Producto con el ID ${pid} no fue encontrado` });
    }

    // Verificar permisos del usuario
    const isAdmin = req.user.role === 'admin';
    const isPremium = req.user.role === 'premium' && product.owner === req.user.email;

    if (isAdmin || isPremium) {
      let idProduct = await productService.delete(pid);
      return res.send({ msg: `Producto ${pid} fue eliminado correctamente`, payload: idProduct });
    } else {
      return res.status(403).send({ msg: "No tienes permisos para eliminar este producto" });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, error: " Error al eliminar un producto" });
  }


};








