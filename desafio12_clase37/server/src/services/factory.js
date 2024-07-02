import MongoSingleton from '../config/mongodb-singleton.js';
import config from '../config/config.js';


let productService
let cartService

//TODO - falta implementar el servicio de users para mongodb y para files

/*=============================================
=       connectMongoDB - singleton           =
=============================================*/
async function initializeMongoService() {
    console.log("Iniciando servicio para MongoDB");
    try {
        await MongoSingleton.getInstance()
    } catch (error) {
        console.error("Error al iniciar MongoDB:", error);
        process.exit(1); // Salir con código de error
    }
}




switch (config.persistence) {
    case 'mongodb':
        initializeMongoService()
        const { default: ProductServiceMongo } = await import('./dao/db/product.service.js')
        productService = new ProductServiceMongo();
        console.log("Servicio de productos cargado:");
        console.log(productService);

        const { default: CartsServiceMongo } = await import('./dao/db/cart.service.js')
        cartService = new CartsServiceMongo();
        console.log("Servicio de cart cargado:");
        console.log(cartService);
        break;
        
    case 'files':
        const { ProductServiceFileSystem } = await import('./dao/filesystem/product.service.js')
        productService = new ProductServiceFileSystem();
        console.log("Servicio de productos cargado:");
        console.log(productService);

        const { CartsServiceFileSystem } = await import('./dao/filesystem/cart.service.js')
        cartService = new CartsServiceFileSystem();
        console.log("Servicio de cart cargado:");
        console.log(cartService);
        break;



    default:
        break;
}

export { productService, cartService } // consumidas por los controllers de product y carts