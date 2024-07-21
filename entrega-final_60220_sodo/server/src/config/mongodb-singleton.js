import mongoose from 'mongoose'
import config from './config.js'



export default class MongoSingleton {
    static #instance;

    constructor() {
        this.#connectMongoDB();
    }

    static getInstance() {
        if (this.#instance) {
            //console.log("Ya se ha abierto una conexion a MongoDB.");
        } else {
            this.#instance = new MongoSingleton()
        }
        return this.#instance
    }


    #connectMongoDB = async () => {
        try {
            mongoose.connect(config.mongoUrl,
            //mongoose.connect(config.mongoUrlTest,
            {
                w: 1,
            }
        );
            //console.log("Conectado con exito a MongoDB usando Mongoose.");
        } catch (error) {
            //console.error("No se pudo conectar a la BD usando Mongoose: " + error);
            process.exit();
        }
    }
}


