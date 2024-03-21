import { Router } from 'express';
import userModel from '../dao/db/models/user.js';

const router = Router();

//? ACA VAN LAS APIS. TODA LA LOGICA DE LAS SESIONES ACA.  users.views.router SOLO GENERABA RENDERS



// API PARA REGISTER
router.post("/register", async (req, res) => {
   const{ first_name, last_name, email, age , password } = req.body;
   console.log("registrando Usuario");
   console.log(req.body);

   // verificamos si el usuario ya esta registrado
   const exist = await userModel.findOne({email})
   if(exist){
    return res.status(402).send({status:'error', msg: 'Usuario ya existe'})
   }

    const user = {
        first_name, 
        last_name, 
        email, 
        age, 
        password //!se deberia encriptar
    }

    const result = await userModel.create(user)
    res.send({ status: "success", message: "Usuario creado con extito con ID: " + result.id }); // nunca retornemos el result solo, porque ahi viene tambien el password. Retornamos result.id
});




// API PARA LOGIN (en teoria ya esta registrado (signin)). por eso solo pedimos por req body email y password
router.post("/login", async (req, res) => {
    const{ email, password } = req.body;

   // nuevamente verificamos si el usuario ya esta registrado
   const user = await userModel.findOne({ email, password }) // Ya que el password no está hasheado (por el momento), podemos buscarlo directamente. Mas adelante al encriptarlo, se hace diferente.
   if(!user){
    return res.status(401).send({status:'error', msg: 'Incorrect credentials'})
   }

   //* si se encontro un user valido, EN ESTE PUNTO CREO LA SESSION
   req.session.user = {
    // en este objeto pasamos la informacion que se necesita para la plantilla products. Es decir, para el endpoint /products
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age
   };
   req.session.admin = true;
   res.send({ status: "success", payload: req.session.user, msg: "Productos" }); 
});







export default router;