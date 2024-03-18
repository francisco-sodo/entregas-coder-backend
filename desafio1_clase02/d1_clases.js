// node d1_clases.js

class ProductManager {

    constructor() {
        this.products = []
        this.idGenerator = 1
    }


    //! ***********  metodos

    addProduct(title, description, price, thumbnail, code, stock){

        // validando que todos los campos esten completos
        if(!title || !description || !price || !thumbnail || !code || !stock){
            return console.error(`******\nNo se pudo ingresar el producto solicitado. Debe completar todos los campos\n******`);
        }

        // verificando que no se repitan el code al ingresar productos
        const uniqueCode = this.products.some(prod => prod.code === code);
        if(uniqueCode){
            return console.error(`******\nEl codigo ${code} del ${title} ingresado ya existe\n******`)
        }

       // generando id autoincrementable
        let id = this.idGenerator++

        const newProduct = {title, description, price, thumbnail, code, stock, id};
        this.products.push(newProduct)
    }
    
    
    getProducts(){
        // obteniendo y mostrando todos los productos agregados en el array
        return console.log(this.products)
    }


    getProductById(id){
        // buscar en el array el producto que coincida con el id
        // usar find
        // mostrar en consola Not Found de no encontrar el id

        const productId = this.products.find(prod => prod.id === id)
       
        productId 
        ? console.log(`******\nProduct ID ${id} was found\n******`)
        : console.error( `******\nProduct ID Not Found :(\n******` )
    }
}


    //! ***** instanciando clase (creando objeto)

    const productManager = new ProductManager();

    //! ***** inicializando metodos

    //?PRODUCTO 1
    productManager.addProduct(
        'Producto1', 
        'este es el Producto1', 
        200, 
        './imagen_01.jpg', 
        'A123',
        12);
    //?PRODUCTO 2
    productManager.addProduct(
        'Producto2', 
        'este es el Producto2', 
        120, 
        './imagen_02.jpg', 
        'B123',
        5);
    //?PRODUCTO 3
    productManager.addProduct(
        'Producto3', 
        'este es el Producto3', 
        89.99, 
        './imagen_03.jpg', 
        'C123',
        27
        );

    productManager.getProducts()

    productManager.getProductById(1)
