import { Router } from "express";
import { passportCall, authorization } from "../utils.js";
import { productService } from "../services/service.js";
import { productsModel } from "../services/dao/db/models/products.model.js";

const router = Router();

//PAGINATION con HB. VISTA DE TODOS LOS PRODUCTOS
// EJ: http://localhost:8080/products?page=1

router.get("/", passportCall("jwt"), authorization("user", "premium", "admin"), async (req, res) => {
    // default page
    let page = parseInt(req.query.page);
    if (!page) page = 1;

    // sort filter
    let sort = req.query.sort;
    let sortFilter = {};
    if (sort === "des") {
      sortFilter = { price: -1 };
    } else if (sort === "asc") {
      sortFilter = { price: 1 };
    }

    //query filter
    let search = req.query.search;
    let categoryFilter = {};
    categoryFilter = { category: search };

    try {
      let result = await productsModel.paginate(
        {},
        { page, limit: 6, lean: true, sort: sortFilter }
      );

      result.prevLink = result.hasPrevPage ? `?page=${result.prevPage}` : "";
      result.nextLink = result.hasNextPage ? `?page=${result.nextPage}` : "";
      result.isValid = !(page < 1 || page > result.totalPages);

      // buscar por orden de precio ---  http://localhost:8080/products?page=1&sort=asc
      if (sort) {
        result.prevLink = result.hasPrevPage
          ? `?page=${result.prevPage}&sort=${sort}`
          : "";
        result.nextLink = result.hasNextPage
          ? `?page=${result.nextPage}&sort=${sort}`
          : "";
        result.isValid = !(page < 1 || page > result.totalPages);
      }

      // buscar por categoria ("Usado" / "Nuevos") ---   http://localhost:8080/products?page=1&search=Usado
      if (search) {
        result = await productsModel.paginate(categoryFilter, {
          page,
          limit: 6,
          lean: true,
          sort: sortFilter,
        });

        result.prevLink = result.hasPrevPage
          ? `?page=${result.prevPage}&search=${search}`
          : "";
        result.nextLink = result.hasNextPage
          ? `?page=${result.nextPage}&search=${search}`
          : "";
        result.isValid = !(page < 1 || page > result.totalPages);

        // buscar por categoria y por orden de precio ---  http://localhost:8080/products?page=1&search=Usado&sort=asc
        if (sort) {
          result.prevLink = result.hasPrevPage
            ? `?page=${result.prevPage}&search=${search}&sort=${sort}`
            : "";
          result.nextLink = result.hasNextPage
            ? `?page=${result.nextPage}&search=${search}&sort=${sort}`
            : "";
          result.isValid = !(page < 1 || page > result.totalPages);
        }
      }

      let user = req.user;
      let role = req.user.role;

      // condicional para que admin pueda entrar a productos sin que de error por no reconocer un cart id
      if (role !== "admin") {
        let cid = user.cart._id;

        res.render("products", {
          title: "Vista | Productos",
          styleProds: "styleProducts.css",
          user: user,
          products: result.docs,
          totalDocs: result.totalDocs,
          currentPage: result.page,
          totalPages: result.totalPages,
          prevLink: result.prevLink,
          nextLink: result.nextLink,
          isValid: result.isValid,
          isAdmin: req.user.role === "admin",
          isUser: req.user.role === "user",
          isPremium: req.user.role === "premium",
          cid: cid,
        });
      } else {
        res.render("products", {
          title: "Vista | Productos",
          styleProds: "styleProducts.css",
          user: user,
          products: result.docs,
          totalDocs: result.totalDocs,
          currentPage: result.page,
          totalPages: result.totalPages,
          prevLink: result.prevLink,
          nextLink: result.nextLink,
          isValid: result.isValid,
          isAdmin: req.user.role === "admin",
          isUser: req.user.role === "user",
          isPremium: req.user.role === "premium",
        });
      }
    } catch (error) {
      res.status(500).send("Error interno del servidor");
      req.logger.error("500: Error al obtener productos paginados:" + error);
    }
  });

// VISTA DE UN SOLO PRODUCTO
//EJ: http://localhost:8080/products/product/65f39b4e3942d59690fbe26f

router.get("/product/:pid",passportCall("jwt"),authorization("user", "premium", "admin"),async (req, res) => {
    let { pid } = req.params;
    let user = req.user;
    let role = req.user.role;
    try {
      let product = await productService.getById(pid);
      if (!product) {
        res
          .status(404)
          .send({ status: 404, error: "No se encontró el producto" });
          req.logger.error("404: No se encontró el producto");
        return;
      }

      // condicional para que admin pueda entrar a productos sin que de error por no reconocer un cart id
      if (role !== "admin") {
        let cid = user.cart._id;

        res.render("product", {
          title: "Vista | Producto",
          cid: cid,
          isNotAdmin: req.user.role !== "admin",
          product: {
            _id: product._id,
            title: product.title,
            price: product.price,
            description: product.description,
            code: product.code,
            status: product.status,
            stock: product.stock,
            category: product.category,
            thumbnails: product.thumbnails,
          },
        });
      } else {
        res.render("product", {
          title: "Vista | Producto",
          isNotAdmin: req.user.role !== "admin",
          product: {
            _id: product._id,
            title: product.title,
            price: product.price,
            description: product.description,
            code: product.code,
            status: product.status,
            stock: product.stock,
            category: product.category,
            thumbnails: product.thumbnails,
          },
        });
      }
    } catch (error) {
      res
      .status(500)
      .send({ status: 500, error: "Error al obtener el producto por su ID" });
      req.logger.error("Error al obtener el producto por su ID:" + error);
    }
  }
);

export default router;
