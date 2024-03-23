import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import bcrypt from 'bcrypt';


// config ruta absoluta
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;



// configuracion para el proceso de HASHEO por bctypt

// creando hash - el usuario se registra
export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))
// verificando hash - el usuario se loguea
export const isValidPassword = (user,password) => bcrypt.compareSync(password, user.password)




// Configuracion de MULTER
// Objeto de configuracion
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







