import { Router } from "express";
import jwt from "jsonwebtoken"; 
import { PRIVATE_KEY } from "../../utils.js";



export default class CustomRouter {
    constructor() {
        this.router = Router();
        this.init();
    };



    getRouter() {
        return this.router;
    } // llama y retorna a this.router. Activamos el Router base de la clase.


    init() { }; //Esta inicialilzacion se usa para las clases heredadas. Inicializa todo el custom Router


    get(path, policies, ...callbacks) {
        //console.log("Entrando por GET a custom router con Path: " + path);
        this.router.get(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,// ya esta apto para que el extend use los customResponse
            this.applyCallbacks(callbacks)
        )
    }

    post(path, policies, ...callbacks) {
        this.router.post(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks));
    };

    put(path, policies, ...callbacks) {
        this.router.put(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks));
    };

    delete(path, policies, ...callbacks) {
        this.router.delete(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks));
    };




    handlePolicies = policies => (req, res, next) => {
        // console.log("Politicas a evaluar:");
        // console.log(policies);

        //Validar si tiene acceso publico:
        if (policies.includes("PUBLIC")) return next() //Puede entrar cualquiera 

        
        //El JWT token se guarda en los headers de autorización.
        const authHeader = req.headers.authorization;
        //console.log("Token present in header auth:");
       // console.log(authHeader);
        if (!authHeader) {
            return res.status(401).send({ error: "User not authenticated or missing token." });
        }
        const token = authHeader.split(' ')[1]; //Se hace el split para retirar la palabra Bearer.


        //Validamos y verificamos token
        jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
            if (error) return res.status(403).send({ error: "Token invalid, Unauthorized!" });
            //Token OK
            const user = credentials.user;

        
            if (!policies.includes(user.role.toUpperCase())) 
            return res.status(403).send({ error: "El usuario no tiene privilegios, revisa tus roles!" });
            // si el rol (user.role) se encuentra dentro de policies, podes ingresar
            req.user = user;
            //console.log(req.user);
            next();
        });
    }



    // Custom responses
    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.status(200).send({ status: "Success", payload })
        res.sendNotFoundResource = error => res.status(202).send({ status: "Not Found", error })
        res.sendInternalServerError = error => res.status(500).send({ status: "Error", error })
        res.sendClientError = error => res.status(400).send({ status: "Client Error, Bad request from client.", error });
        res.sendUnauthorizedError = error => res.status(401).send({ error: "User not authenticated or missing token.", error });
        res.sendForbiddenError = error => res.status(403).send({ error: "Token invalid or user with no access, Unauthorized please check your roles!", error });
        next()
    }


    // función que procese todas las funciones internas del router (middlewares y el callback principal)
    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params)//con apply ejecutamos lo que esta dentro del this.get de la herencia (el callback. (req,res,next))
            } catch (error) {
                //console.log(error);
                params[1].status(500).send(error) // hace referencia al res
            }
        })
    }


}//fin class CustomRouter