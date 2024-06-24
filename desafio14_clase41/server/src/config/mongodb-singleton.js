import mongoose from 'mongoose'
import config from './config.js'


export default class MongoSingleton {


    static #instance;

    constructor() {
        this.#connectMongoDB();
    }
   

    static getInstance() {
        if (this.#instance) {
            console.log("Ya se ha abierto una conexion a MongoDB.");
        } else {
            this.#instance = new MongoSingleton()
        }
        return this.#instance
    }

//! comentar o descomentar si se quiere apuntar o no a la base de datos TEST
    #connectMongoDB = async () => {
        try {
            mongoose.connect(config.mongoUrlTest,
            //mongoose.connect(config.mongoUrl,
            {
                w: 1,
            }
        );
            console.log("Conectado con exito a MongoDB-TEST usando Moongose.");
            //console.log("Conectado con exito a MongoDB usando Moongose.");
        } catch (error) {
            console.error("No se pudo conectar a la BD usando Moongose: " + error);
            process.exit();
        }
    }
    
}


