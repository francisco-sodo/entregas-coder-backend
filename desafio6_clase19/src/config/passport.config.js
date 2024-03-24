import passport from 'passport';
import passportLocal from 'passport-local';
import userModel from '../dao/db/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js'; //bcrypt

//declaramos la estrategia
const localStrategy = passportLocal.Strategy;

// inicializando estrategia local. 'username' sera para nosotros 'email'
//Done() = next()
const initializePassport = () => {


    //? ESTRATEGIA DE REGISTER
    //passReqToCallback: para poder iteracturar con la data que viene del cliente.
    // usernameField: renombramos el username --> IMPORTANTE!
    passport.use('register', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async(req, username, password, done) =>{

            const{ first_name, last_name, email, age} = req.body;

            try {
                // verificamos si el usuario ya esta registrado
                const exist = await userModel.findOne({ email })
                if(exist){
                    console.log("El usuario ya existe")
                    return done(null,false) // no es un error. Es una validacion. Por eso ponemos null (no hay error), false(validacion incorrecta). 
                   }
                   
                   // si el usuario no existe, y puede ser registrado:
                   const user = {
                       first_name, 
                       last_name, 
                       email, 
                       age, 
                       password: createHash(password)
                    }
                    

                // lo damos de alta
                const result = await userModel.create(user)
                return done(null,result)
                
            } catch (error) {
                return done("Error registrando el usuario" + error)
            }
        }
    ))




     //? ESTRATEGIA DE LOGIN
     passport.use('login', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async(req, username, password, done) =>{

            try {
                // verificamos si el usuario ya esta registrado
                const user = await userModel.findOne({ email:username })
                if(!user){
                    console.warn("Invalid credentials for user " + username)
                    return done(null,false) // no es un error. Es una validacion. Por eso ponemos null (no hay error), false(validacion incorrecta). 
                   }

                // validamos password hasheado con bycrypt
                if(!isValidPassword(user, password)){
                    console.warn("Invalid credentials for user " + username)
                    return done(null,false)
                }
                //* si se encontro un user valido, EN ESTE PUNTO CREO LA SESSION
                return done(null, user)
                
            } catch (error) {
                return done("Error logueando el usuario" + error)
            }
        }
    ))




// serializar y des serializar. Se hace independientemente de la estrategia
// son dos funciones:

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        let user = await userModel.findById(id);
        done(null, user)
    } catch (error) {
        console.error("Error deserializando el usuario: " + error);
    }
})




};








export default initializePassport
