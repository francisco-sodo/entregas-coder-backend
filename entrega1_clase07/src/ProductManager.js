import fs from 'fs'

export class Product {
    
    constructor(title, description, code, price, status, stock, category, thumbnail){
        
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.stock = stock;
        this.category = category;
        this.thumbnail = thumbnail;

    } 
};


export class ProductManager {

    #products;
    #productsDirPath;
    #productsFilePath;
    #fileSystem;

    constructor() {
        this.#products = new Array();
        this.#productsDirPath = './src/files'; 
        this.#productsFilePath = this.#productsDirPath + '/productos.json';
       
        this.#fileSystem = fs
    }
   
 //todo **********   RANDOM ID   **************
  randomIdGenerator = async () => {
    let code = "";
    // Generar 3 números aleatorios entre 0 y 9
    for (let i = 0; i < 3; i++) {
      code += Math.floor(Math.random() * 10);
    }
    // Generar una letra aleatoria entre A (65) y Z (90) (códigos ASCII)
    const randomLetter = String.fromCharCode(
      Math.floor(Math.random() * (90 - 65 + 1)) + 65
    );
    code += randomLetter;
    return code;
  };   
    

//todo **********   CREAR DIR O ARCHIVO SI NO EXISTEN   **************
  createDirOrFile = async()=>{
    await this.#fileSystem.promises.mkdir(this.#productsDirPath, {
      recursive: true,
    });
    if (!this.#fileSystem.existsSync(this.#productsFilePath)) {
      await this.#fileSystem.promises.writeFile(this.#productsFilePath, "[]");
    }
  }



//todo **********   GET PRODUCTS   **************
getProducts = async () => {
  try{
     await this.createDirOrFile()

      let productsFile = await this.#fileSystem.promises.readFile(this.#productsFilePath, 'utf-8')
      this.#products = JSON.parse(productsFile)
      return this.#products

  } catch (error) {
      throw Error(`ERROR AL CONSULTAR PRODUCTOS: ${JSON.stringify(this.#productsDirPath)}.\nDetalle del error: ${error}`);
  } 
}


//todo **********   GET PRODUCT BY ID  **************
getProductById = async (id) => {
     
    try{
        let productsExist = await this.getProducts()

        if(productsExist.length === 0){return "Aún no existe ningún producto"} 
        else{

            let productId = await this.#products.find(prod => prod.id === id)
            return productId
        }
       
    } catch (error){
        throw Error(`ERROR AL BUSCAR UN PRODUCTO POR ID: ${JSON.stringify(this.#productsDirPath)}.\nDetalle del error: ${error}`);
    }
}


//todo **********   ADD PRODUCT   **************
addProduct = async ({title, description, code, price, status, stock, category, thumbnail}) => {

    // Verificar si todos los campos obligatorios están presentes y no son nulos o indefinidos
    if (!title || !description || !code || !price || !status || !stock || !category) {
        return "Todos los campos son obligatorios y deben estar completos";
    }

    let newProduct = new Product(title, description, code, price, status, stock, category, thumbnail);

    let idProd = await this.randomIdGenerator()
    newProduct.id = idProd

        try{
            await this.getProducts()
            // verificando que no se repitan el code al ingresar productos
            const uniqueCode = this.#products.some(prod => prod.code === code);
            if(uniqueCode){ 
                return `El codigo ${code} del ${title} ingresado ya existe`
            } else{
                this.#products.push(newProduct)
            }
            
            await this.#fileSystem.promises.writeFile(this.#productsFilePath, JSON.stringify(this.#products, null, 2, '\t'));
            return newProduct

        
        } catch(Error){
            console.error(`ERROR AL AGREGAR PRODUCTO NUEVO: ${Error}`);
        }
}



//todo **********   UPDATE PRODUCT   **************

    //recibimos producto y lo desestructuramos en los parametros para separar el id del resto de las propiedades
    updateProduct = async ({id,...updprod}) =>  {

        try{
        //eliminamos producto a actualizar usando su id
        await this.deleteProduct(id)
        //leemos el archivo con los productos que quedaron
        await this.getProducts();
        //generamos nuevo array donde estan los productos anteriores y el nuevo producto actualizado que conserva su id anterior.
        let prodsUpdated = [
            {...updprod, id:id}, ...this.#products
        ];
        
        //Se sobreescribe el archivos de productos.json para persistencia.
        await this.#fileSystem.promises.writeFile(this.#productsFilePath, JSON.stringify(prodsUpdated, null, 2, '\t'));
        //console.log("DESDE LA CLASE ME RETORNA",prodsUpdated)
        return prodsUpdated

    } catch(error){
        throw Error(`ERROR AL MODIFICAR UN PRODUCTO: ${JSON.stringify(this.#productsDirPath)}.\nDetalle del error: ${error}`);
    }
    
    }


//todo **********   DELETE PRODUCT   **************
    deleteProduct = async (id) => {

        try{
           
            await this.getProducts();
            const productsSize = this.#products.length;
      
            //buscamos el registro por el id
            const productPosition = this.#products.findIndex((prod => prod.id === id));
                if (productPosition < 0) {
                return console.log('producto no encontrado');
            }
            // Eliminamos el registro
            this.#products.splice(productPosition, 1);
                if (this.#products.length === productsSize) {
                   return console.log('producto no se pudo eliminar')
                }

              await this.#fileSystem.promises.writeFile(this.#productsFilePath, JSON.stringify(this.#products, null, 2, '\t'));
              return this.#products

        } catch (error){
            throw Error(`ERROR AL ELIMINAR UN PRODUCTO: ${JSON.stringify(this.#productsDirPath)}.\nDetalle del error: ${error}`);
        }
    }




} 
// * FIN DE CLASE



