import fs from 'fs'


class Product {
    
    constructor(title, description, price, thumbnail, code, stock, id){
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = id;
    }

    static idGenerator = 1;
  
};

export class ProductManager {

    #products;
    #productsDirPath;
    #productsFilePath;
    #fileSystem;

    constructor() {
        this.#products = new Array();
        this.#productsDirPath = './src/files'; //directorio
        this.#productsFilePath = this.#productsDirPath + '/productos.json'; //ruta
        // this.#fileSystem = require('fs');
        this.#fileSystem = fs
    }


//todo **********   ADD PRODUCT   **************

    addProduct = async (title, description, price, thumbnail, code, stock) => {


        // validando que todos los campos esten completos
        if(!title || !description || !price || !thumbnail || !code || !stock){
            return console.error(`******\nNo se pudo ingresar el producto solicitado. Debe completar todos los campos\n******`);
        }

        //instancia de clase Product
        //* newProduct
        let id = Product.idGenerator++;
        let newProduct = new Product(title, description, price, thumbnail, code, stock, id);
        console.log("*** Nuevo producto: ***");
        console.log(newProduct);

        //entorno asincronico
        try{
            //creacion directorio ./files
            await this.#fileSystem.promises.mkdir(this.#productsDirPath, {recursive: true});
            //validacion con existSync. Si no exite archivo productos.json, crearlo.
            if(!this.#fileSystem.existsSync(this.#productsFilePath)) {
                //creacion de archivo productos.json vacio
                await this.#fileSystem.promises.writeFile(this.#productsFilePath, '[]');
            }

            //lectura de archivo
            let productsFile = await this.#fileSystem.promises.readFile(this.#productsFilePath, 'utf-8')
          
            // Agregamos al array la informacion que hay en el archivo y ademas hacemos un parseo de .json a Objeto.
            this.#products = JSON.parse(productsFile)
          
            //* verificando que no se repitan el code al ingresar productos
            const uniqueCode = this.#products.some(prod => prod.code === code);
            if(uniqueCode){
                throw Error(`\n!!! El codigo ${code} del ${title} ingresado ya existe !!!\n`)

                } else{
                    this.#products.push(newProduct)
            }
            
            //Se sobreescribe el archivos de productos.json para persistencia.
            await this.#fileSystem.promises.writeFile(this.#productsFilePath, JSON.stringify(this.#products, null, 2, '\t'));
            
           
        } catch(Error){
            console.error(`ERROR AL AGREGAR PRODUCTO NUEVO: ${JSON.stringify(newProduct)}.\nDetalle del error: ${Error}`);
        }
    }


//todo **********   GET PRODUCTS   **************

     
    getProducts = async () => {
        try{
            // //creamos directorio
            // await this.#fileSystem.promises.mkdir(this.#productsDirPath, { recursive: true })
            // //Validamos que exista ya el archivo con productos sino se crea vacío para ingresar nuevos:
            // if(!this.#fileSystem.existsSync(this.#productsFilePath)) {
            //     //Se crea el archivo vacio.
            //     await this.#fileSystem.promises.writeFile(this.#productsFilePath, "[]");
            //     console.log('No hay productos agregados')
            // }
            //leemos el archivo
            let productsFile = await this.#fileSystem.promises.readFile(this.#productsFilePath, 'utf-8');
            // de JSON a Objeto
            this.#products = JSON.parse(productsFile)

            return this.#products;

        } catch (error) {
            console.error(`ERROR AL CONSULTAR PRODUCTOS, VALIDE EL ARCHIVO: ${JSON.stringify(this.#productsDirPath)}.\nDetalle del error: ${error}`);
            throw Error(`ERROR AL CONSULTAR PRODUCTOS, VALIDE EL ARCHIVO: ${JSON.stringify(this.#productsDirPath)}.\nDetalle del error: ${error}`);
        } 
    }


//todo **********   GET PRODUCT BY ID  **************


    getProductById = async (id) => {
     
        try{

            //leemos el archivo reutilizando la funcion para leer archivos
           await this.getProducts();
           console.info("Buscando producto por ID... ");
           
            const productId = await this.#products.find(prod => prod.id === id)
            productId 
            ? console.log(`******\nProduct ID ${id} was found\n******`) 
            : console.error( `******\nProduct ID ${id} Not Found :(\n******`)
            return console.log(productId || "")

        } catch (error){
            throw Error(`ERROR AL BUSCAR UN PRODUCTO POR ID: ${JSON.stringify(this.#productsDirPath)}.\nDetalle del error: ${error}`);
        }
    }



//todo **********   UPDATE PRODUCT   **************

    //recibimos producto y lo desestructuramos en los parametros para separar el id del resto de las propiedades
    updateProduct = async ({id, ...updprod}) =>  {

        try{

        //eliminamos producto a actualizar usando su id
        await this.deleteProduct(id)
        
        //leemos el archivo con los productos que quedaron
        await this.getProducts();
     
        //generamos nuevo array donde estan los productos anteriores y el nuevo producto actualizado que conserva su id anterior.
        let prodsUpdated = [
            {...updprod, id}, ...this.#products
        ];
        
        
        console.log(`Se ha ACTUALIZADO el producto con el id ${id}`)
        // console.log(prodsUpdated)

        //Se sobreescribe el archivos de productos.json para persistencia.
        await this.#fileSystem.promises.writeFile(this.#productsFilePath, JSON.stringify(prodsUpdated, null, 2, '\t'));

    } catch(error){
        throw Error(`ERROR AL MODIFICAR UN PRODUCTO: ${JSON.stringify(this.#productsDirPath)}.\nDetalle del error: ${error}`);
    }
        

    }



//todo **********   DELETE PRODUCT   **************

    deleteProduct = async (id) => {

        try{
            //leemos el archivo
            await this.getProducts();
           

            const productIndex = this.#products.findIndex(prod => prod.id === id);
            if (productIndex !== -1) {
                // El producto existe, lo eliminamos del array
                const filterProductbyId = this.#products.filter(prod => prod.id !== id);
                console.info("Buscando producto por ID para ELIMINARLO... ");
                console.log(`Se ha borrado el producto con el ID: ${id}`);
                
                // Se sobreescribe el archivo de productos.json para persistencia.
                await this.#fileSystem.promises.writeFile(this.#productsFilePath, JSON.stringify(filterProductbyId, null, 2, '\t'));
            } else {
                console.log(`El producto con el ID ${id} no existe. No se ha realizado ninguna eliminación.`);
            }

        } catch (error){
            throw Error(`ERROR AL ELIMINAR UN PRODUCTO: ${JSON.stringify(this.#productsDirPath)}.\nDetalle del error: ${error}`);
        }
    }



}



//exportando clase ProductManager para usar en index.js
//module.exports = ProductManager;

//export {ProductManager}
