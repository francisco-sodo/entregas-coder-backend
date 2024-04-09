import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';



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
        //cb(null, `${__dirname}/src/public/img`)
    },

    // el nombre que quiero que tengan los archivos que voy a subir
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

export const uploader = multer({
    storage,
    // si se genera algun error, lo capturamos
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

export const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT";

// 1) FUNCION PARA GENERAR TOKEN
export const generateJWToken = (user) => {
    return jwt.sign( {user} ,PRIVATE_KEY, { expiresIn: '1h'} );
};
// Esta funcion me retorna un TokenJWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c


// 2) FUNCION PARA AUTENTICAR Y VERIFICAR TOKEN
// export const authToken = (req, res, next) =>{
//     //El TokenJWT se guarda en los headers de autorización.
//     const authHeader = req.headers.authorization
//     // Beare eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
//     console.log("Token present in header auth:");
//     console.log(authHeader);

//     // si no me retorna token...
//     if (!authHeader) {
//         return res.status(401).send({ error: "User not authenticated or missing token."})
//     }
//     // si me retorna token...
//     const token = authHeader.split(' ')[1] // Se hace el split para retirar la palabra Bearer. Me queda el token limpio.
//     //Validar token
//     jwt.verify(token, PRIVATE_KEY, (error, credentials) =>{
//         //error token
//         if (error) return res.status(403).send({error: "Token invalid, Unauthorized!" })
//         //ok token
//         req.user = credentials.user; //accedo al usuario que viene dentro de ese token
//         console.log('REQ.USER DESDE UTILS');
//         console.log(req.user);
//         next()
//     })
// };



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
=                    ROLES                    =
=============================================*/

//* para manejo de Auth
export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("Unauthorized: User not found in JWT");
        if (req.user.role !== role) {//comparo el rol que me rtae el usuario con el rol que pasamos por parametro en users.view.routes.js en el endpoint que renderiza el perfil del usuario. En este caso, le pasamos el rol 'admin'. Entonces, si este nuevo usuario no es admin, no podra pasar (Forbiden)
            return res.status(403).send("Forbidden: El usuario no tiene permisos con este rol.");
        }
        next();
    }
};


export default __dirname;