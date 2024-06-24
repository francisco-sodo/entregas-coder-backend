import CustomRouter from './custom.routes.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import * as UserController from '../../controllers/users.controller.js'



export default class UsersExtendRouter extends CustomRouter {
    init() { 
        // inicializa todo el custom router.
       
        // con el this hacemos referencia al get de CustomRouter
        this.get("/", ["PUBLIC"], (req,res)=>{ //path,policies(PUBLIC),callbacks
            res.sendSuccess(req.user) // este es el payload
        }) 



            this.get("/current", ["PUBLIC"], (req, res) => {

            let token;
            if (req.headers.authorization) {
                token = req.headers.authorization.split(' ')[1];
            } else if (req.cookies && req.cookies.jwtCookieToken) {
                token = req.cookies.jwtCookieToken;
            }
        
            if (!token) {
                return res.status(401).send({ error: "No token provided." });
            }
        
            const decodeToken = jwt.decode(token);
            res.sendSuccess(decodeToken);
        });






        this.get("/current/admin", ["ADMIN"], (req, res) => {
           res.sendSuccess(req.user);
        });

        this.get("/current/user", ["USER"], (req, res) => {
            res.sendSuccess({payload: req.user});
            
         });

         //GET ALL USERS
         this.get('/all',["PUBLIC"],UserController.getAllUsers)








        // ? LOGIN Y REGISTER ABIERTO PUBLICAMENTE 
        // LOGIN
        this.post('/login', ['PUBLIC'], UserController.userLogin) 

        // LOGOUT
        this.get('/logout', ['PUBLIC'], UserController.userLogout)

        // REGISTER
        this.post('/register', ['PUBLIC'], UserController.userRegister) 
        // GITHUB LOGIN
        // endpoint para API de estrategia de login con github (passport.config)
        this.get('/github', ["PUBLIC"], passport.authenticate('github', {scope: ['user:email']} ), async(req,res) =>{});
        // GITHUB LOGIN CALLBACK
        this.get('/githubcallback', ['PUBLIC'], passport.authenticate('github', { session: false, failureRedirect:'/github/error'} ),  UserController.userRegisterByGithub)



        
    } // fin de init
    

} // fin class UsersExtendRouter






