
//repository
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
        return res
          .status(400)
          .send({
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
    res
      .status(500)
      .send({ status: 500, error: " No se pueden mostrar los productos" });
      console.log(error)
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
    res
      .status(500)
      .send({
        status: 500,
        error: " Error al querer mostrar un producto por ID",
      });
  }
};

export const getProductByTitle = async (req, res) => {
  let title = req.params.title;
  
  try {
    console.log("Busqueda Producto");
    let queryProduct = await productService.getByTitle(title);

    if (!queryProduct) {
      res.status(404).send({ message: "No se ha encontrado el Producto" });
      throw new Error("No se ha encontrado el Producto");
    } else {
      res.json(queryProduct);
    }
  } catch (error) {
    res
      .status(500)
      .send({
        status: 500,
        error: " Error al querer mostrar un producto por /:title",
      });
  }
};


export const getProductByCategory = async (req, res) => {
  let category = req.params.category;
  try {
    console.log("Busqueda Producto por categoria");
    let queryProduct = await productService.getByCategory(category);

    if (!queryProduct) {
      res.status(404).send({ message: "No se ha encontrado el Producto por categoria" });
      throw new Error("No se ha encontrado el Producto por categoria");
    } else {
      res.json(queryProduct);
    }
  } catch (error) {
    res
      .status(500)
      .send({
        status: 500,
        error: " Error al querer mostrar un producto por /:category",
      });
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
        newProduct.owner = adminUser.email; // Asigna el email del admin por defecto
        
    } else {
        throw new Error("Admin user no encontrado");
    }
}

  let newPost = await productService.create(newProduct);
  res.json(newPost)

        } catch (error) {
          console.error(error.cause);
          res.status(500).send({ error: error.code, message: error.message });
        }
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
    res
      .status(500)
      .send({ status: 500, error: " Error al querer editar un producto" });
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
      //console.log("ACKNOWLEDGED", idProduct);
      return res.send({ msg: `Producto ${pid} fue eliminado correctamente`, payload: idProduct });
    } else {
      return res.status(403).send({ msg: "No tienes permisos para eliminar este producto" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 500, error: " Error al eliminar un producto" });
  }

};








