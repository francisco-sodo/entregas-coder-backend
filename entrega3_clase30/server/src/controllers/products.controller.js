// import { Router } from "express";
// const router = Router();


//factory
//import { productService } from '../services/factory.js'

//repository
import { cartService, productService } from '../services/service.js';



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
  let newProduct = req.body;
  try {
    let newPost = await productService.create(newProduct);
    newPost
      ? res.json(newPost)
      : res
          .status(404)
          .send({
            error: `El Producto con el ID ${pid} no pudo agregarse correctamente`,
          });
  } catch (error) {
    res
      .status(500)
      .send({
        status: 500,
        error: `El codigo del producto ingresado ya existe.`,
        msg: " Error al querer agregar un producto",
      });
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
    let idProduct = await productService.delete(pid);
    console.log("ACKNOWLEDGED", idProduct);
    idProduct
      ? res.send({
          msg: `Producto con el ID ${pid} fue eliminado correctamente`,
        })
      : res.send({ msg: `Producto No encontrado` });
  } catch (error) {
    res
      .status(500)
      .send({ status: 500, error: " Error al eliminar un producto" });
  }
};


//!
export const buyProduct = async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.user; // Suponiendo que tienes el ID del usuario en el objeto de solicitud

  try {
    // Verificar si el producto existe
    const product = await productService.getById(productId);
    if (!product) {
      return res.sendNotFoundResource({ message: "Producto no encontrado" });
    }

    // Agregar el producto al carrito del usuario
    await cartService.addToCart(userId, productId);

    return res.sendSuccess({ message: "Producto comprado y agregado al carrito" });
  } catch (error) {
    console.error(error);
    return res.sendInternalServerError({ error: "Error al comprar el producto" });
  }
};
