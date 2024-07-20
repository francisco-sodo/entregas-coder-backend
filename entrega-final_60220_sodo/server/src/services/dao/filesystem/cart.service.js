import __dirname from '../../../utils.js';
import fs from "fs";
import { ProductServiceFileSystem } from "./product.service.js";
let allProductsService = new ProductServiceFileSystem()



export class Cart {
     constructor(id, products) {
          this.id = id;
          this.products = products;
     }
}

export class CartsServiceFileSystem {
     #cart;
     #cartDirPath;
     #cartFilePath;
     #fileSystem;

     constructor() {
          this.#cart = new Array();
          this.#cartDirPath = __dirname + '/files'; 
          this.#cartFilePath = this.#cartDirPath + "/carts.json";
          this.#fileSystem = fs;
     }

     //-**********   RANDOM ID CART   **************
     randomIdCartGenerator = async () => {
          let code = "";
          for (let i = 0; i < 9; i++) {
               code += Math.floor(Math.random() * 10);
          }
          // Generar una letra aleatoria entre A (65) y Z (90) (códigos ASCII)
          const randomLetter = String.fromCharCode(
               Math.floor(Math.random() * (90 - 65 + 1)) + 65
          );
          return randomLetter + '-' + code;
     };

     //-**********   CREAR DIR O ARCHIVO SI NO EXISTEN   **************
     createDirOrFile = async () => {
          await this.#fileSystem.promises.mkdir(this.#cartDirPath, {
               recursive: true,
          });
          if (!this.#fileSystem.existsSync(this.#cartFilePath)) {
               await this.#fileSystem.promises.writeFile(this.#cartFilePath, "[]");
          }
     };

     //- **********   GET CARTS   **************
     getAll = async () => {
          try {
               await this.createDirOrFile();

               let cartFile = await this.#fileSystem.promises.readFile(
                    this.#cartFilePath,
                    "utf-8"
               );
               this.#cart = JSON.parse(cartFile);

               if(this.#cart.length === 0) {return "Aún no existe ningún carrito"}
               else{
                    return this.#cart;
               }

          } catch (error) {
               throw Error(
                    `ERROR AL CONSULTAR CARRITO: ${JSON.stringify(
                         this.#cartDirPath
                    )}.\nDetalle del error: ${error}`
               );
          }
     };

     //- **********   GET CART BY ID  **************
     getById = async (id) => {
          try {
               await this.getAll();

               if(this.#cart.length === 0) return "Aún no tienes ningun carrito agregado."
          
               let cartId = await this.#cart.find(cart => cart.id === id);
               return cartId

          } catch (error) {
               throw Error(
                    `ERROR AL BUSCAR UN CARRITO POR ID: ${JSON.stringify(
                         this.#cartDirPath
                    )}.\nDetalle del error: ${error}`
               );
          }
     };


     //- **********   POST CART    **************
     create = async () => {
          try {
               let idCart = await this.randomIdCartGenerator();
               let newCart = new Cart(idCart, []);
               // console.log("*** Nuevo carrito: ***");
               // console.log(newCart);

               await this.createDirOrFile();
               await this.getAll();

               this.#cart.push(newCart);

               await this.#fileSystem.promises.writeFile(
                    this.#cartFilePath,
                    JSON.stringify(this.#cart, null, 2, "\t")
               );

               return this.#cart;
          } catch (error) {
               throw Error(`ERROR AL AGREGAR CARRITO NUEVO: ${error}`);
               
          }
     };


     //- **********   PUT PRODUCTS IN CART    **************        
     update = async (cid,pid) =>{

          
          //verificando si existe el carrito por id
          let cartById = await this.getById(cid)
          if(!cartById) return `Carrito ${cid} no Encontrado`
          //verificando si existe el producto por id
          let productById = await allProductsService.getById(pid)
          if(!productById) return `Producto ${pid} no Encontrado`

          // Si el producto existe en el carrito, incrementar quantity
          let productExist = cartById.products.find(prod => prod.id === pid);
          productExist 
          ? productExist.quantity++ 
          : cartById.products.push({ id: productById.id, quantity: 1 });
          
          // traer todos los carritos
          let allCarts = await this.getAll();
          
          // Filtrar carritos actuales y concatenarlos con el carrito modificado
          allCarts = allCarts.filter(cart => cart.id !== cid);
          let updatedCarts = [cartById, ...allCarts];
          
          await this.#fileSystem.promises.writeFile(this.#cartFilePath, JSON.stringify(updatedCarts, null, 2, "\t"));
          
          return updatedCarts;    
     }

}
// * FIN DE CLASE
