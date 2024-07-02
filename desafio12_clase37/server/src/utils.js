import { fileURLToPath } from 'url';
import { dirname } from 'path';

import {faker} from '@faker-js/faker'



import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import config from './config/config.js'






// config ruta absoluta
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


/*=============================================
=                    MULTER                  =
=============================================*/
const storage = multer.diskStorage({
    // ubicaion del directorio donde voy a guardar los archivos
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/public/img/`)
    },
    // el nombre que quiero que tengan los archivos que voy a subir
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

export const uploader = multer({
    storage,
    onError: function (err, next) {
        console.log(err);
        next();
    }
})



/*=============================================
=                   BCRYPT                   =
=============================================*/
// creando hash - el usuario se registra
export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))
// verificando hash - el usuario se loguea
export const isValidPassword = (user,password) => bcrypt.compareSync(password, user.password)




/*=============================================
=                     JWT                     =
=============================================*/

//export const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT";
export const PRIVATE_KEY = config.jwtPrivateKey;

// 1) FUNCION PARA GENERAR TOKEN
export const generateJWToken = (user) => {
    return jwt.sign( {user} ,PRIVATE_KEY, { expiresIn: '1h'} );
};


/*=============================================
=                 PASSPORTCALL                =
=============================================*/
//* para manejo de errores
// esta funcion luego se llama en el endpoint luego del login del usuario.
export const passportCall = (strategy) => { 
    return async (req, res, next) => {
        console.log("Entrando a llamar strategy: ");
        console.log(strategy);
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            console.log("Usuario obtenido del strategy: ");
            console.log(user);
            req.user = user;
            next();
        })(req, res, next);
    }
};



/*=============================================
=                 AUTHTOKEN                  =
=============================================*/
//fue sacada de utils.js y llevada a users.extend.routes.js, dentro de la funcion handlePolicies.



/*=============================================
=                    ROLES                    =
=============================================*/

//* para manejo de Auth

export const authorization = (...allowedRoles) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({error:"Error", msg:"Unauthorized: User not found in JWT"});
        const { role } = req.user;
        if (allowedRoles.includes(role)) {//comparo el rol que me rtae el usuario con el rol que pasamos por parametro en users.view.routes.js en el endpoint que renderiza el perfil del usuario. En este caso, le pasamos el rol 'admin'. Entonces, si este nuevo usuario no es admin, no podra pasar (Forbiden)
            return next()
        } else{
            res.status(403).send({error:"Error", msg:"Forbidden: El usuario no tiene permisos con este rol."});
        }
        
    }
};


/*=============================================
=                    FAKER                    =
=============================================*/
faker.locale = 'es'; //Idioma de los datos
export const generateProduct = (owner) => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.datatype.number({ min: 10000, max: 99999 }),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.datatype.number(100),
        category: faker.commerce.productMaterial(),
        id: faker.database.mongodbObjectId().toString(),
        thumbnails: faker.image.imageUrl(),
        owner: owner
    }
};




export default __dirname;