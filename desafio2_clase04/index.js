
//importando clase UserManager desde UserManager.js
const ProductManager = require('./ProductManager.js')

// se crea la instacia de la clase (creando objeto). Esa instancia ya puede acceder a los metodos de la clase (crear y consultar)
let productManager = new ProductManager()
// console.log(productManager);

let persistirProducto = async () => {


//? INICIALIZAR METODO PARA AGREGAR PRODUCTOS //

    // await productManager.addProduct(
    //     'Producto1', 
    //     'este es el Producto1', 
    //     700, 
    //     './imagen_01.jpg', 
    //     'A1',
    //     9); 
    // await productManager.addProduct(
    //     'Producto2', 
    //     'este es el Producto2', 
    //     700, 
    //     './imagen_02.jpg', 
    //     'A2',
    //     9); 
    // await productManager.addProduct(
    //     'Producto3', 
    //     'este es el Producto3', 
    //     700, 
    //     './imagen_03.jpg', 
    //     'A3',
    //     9); 
    // await productManager.addProduct(
    //     'Producto4', 
    //     'este es el Producto4', 
    //     700, 
    //     './imagen_04.jpg', 
    //     'A4',
    //     9); 
    

//? INICIALIZAR METODO PARA OBTENER PRODUCTOS //
    // let products = await productManager.getProducts()
    // console.log(`Productos encontrados en Product Manager: ${products.length}`);
    // console.log(products);

//? INICIALIZAR METODO PARA OBTENER PRODUCTOS POR ID //
    //await productManager.getProductById(6)
    //await productManager.getProductById(6)

//? INICIALIZAR METODO PARA ACTUALIZAR PRODUCTOS //

    // await productManager.updateProduct(
    //     {
    //         "title": "Nuevo Producto2",
    //         "description": "Nuevo Producto2",
    //         "price": 800,
    //         "thumbnail": "./imagen_02.jpg",
    //         "code": "A2",
    //         "stock": 13,
    //         "id": 2
    //       }
    // );

//? INICIALIZAR METODO PARA ELIMINAR PRODUCTOS POR ID //
// await productManager.deleteProduct(1)

  
}

persistirProducto()