import passport from 'passport';
import userModel from '../services/dao/db/models/user.model.js';
import jwtStrategy from 'passport-jwt';
import GitHubStrategy from 'passport-github2'
import { PRIVATE_KEY } from '../utils.js';

import config from './config.js'



const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;



// inicializando estrategia local. 'username' sera para nosotros 'email'
//Done() = next()
const initializePassport = () => {


/*=============================================
=            passport  JwtStrategy            =
=============================================*/

    //Estrategia de obtener Token JWT por Cookie:
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        }, async (jwt_payload, done) => {
            //console.log("Entrando a passport Strategy con JWT.");
            try {
                //console.log("JWT obtenido del Payload");
                //console.log(jwt_payload);
                return done(null, jwt_payload.user)
            } catch (error) {
                return done(error)
            }
        }
    ));

/*=============================================
=           passport  githubStrategy           =
=============================================*/
passport.use('github', new GitHubStrategy(
    {
       
        clientID: config.githubClientId,
        clientSecret: config.githubClientSecret,
        callbackUrl: config.githubCallbackURL


    }, async (accessToken, refreshToken, profile, done) => {
        //console.log('perfil obtenido del usuario');
        //console.log(profile);

        try {
            const user = await userModel.findOne({ email: profile._json.email });

            //console.log("Usuario encontrado para login:", user)
            if(!user){
                // si no se ha logueado antes, se lo registra
                let newUser = {
                    first_name: profile._json.name,
                    last_name:'',
                    age:25,
                    email: profile._json.email,
                    password: '',
                    loggedBy: 'GitHub',
                    last_connection: profile._json.updated_at
                };
                const result = await userModel.create(newUser)
                return done(null,result)
            } else{
                // si el usuario ya se registro anteriormente con github
                return done(null,user)
            }
        } catch (error) {
            return done(error)
        }
    }
));



/*=============================================
=       passport  serialize&deserialize       =
=============================================*/

passport.serializeUser((user, done) => {
    done(null, user._id)
});

passport.deserializeUser(async (id, done) => {
    try {
        let user = await userModel.findById(id);
        done(null, user)
    } catch (error) {
        //console.error("Error deserializando el usuario: " + error);
    }
})
};


/*=============================================
=               COOKIE EXTRACTOR              =
=============================================*/

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {//Validamos que exista el request y las cookies.
        //req.logger.info("Cookies presentes: ", req.cookies)
        token = req.cookies['jwtCookieToken']
    }
    return token;
};






export default initializePassport
