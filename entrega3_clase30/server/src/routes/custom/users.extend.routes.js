import CustomRouter from './custom.routes.js';
import passport from 'passport';

import * as UserController from '../../controllers/users.controller.js'



export default class UsersExtendRouter extends CustomRouter {
    init() { 
        // inicializa todo el custom router.
       
        // con el this hacemos referencia al get de CustomRouter
        this.get("/", ["PUBLIC"], (req,res)=>{ //path,policies(PUBLIC),callbacks
            res.sendSuccess(req.user) // este es el payload
        }) 

      
        this.get("/current", ["USER", "ADMIN", "PREMIUM"], (req, res) => {
            res.sendSuccess(req.user);
        });


        this.get("/current/admin", ["ADMIN"], (req, res) => {
           res.sendSuccess(req.user);
          
        });

        this.get("/current/user", ["USER"], (req, res) => {
            res.sendSuccess(req.user);
           
         });



         //GET ALL USERS
         this.get('/all',["PUBLIC"],UserController.getAllUsers)








        // ? LOGIN Y REGISTER ABIERTO PUBLICAMENTE 
        // LOGIN
        this.post('/login', ['PUBLIC'], UserController.userLogin) 

        // REGISTER
        this.post('/register', ['PUBLIC'], UserController.userRegister) 
        // GITHUB LOGIN
        // endpoint para API de estrategia de login con github (passport.config)
        this.get('/github', ["PUBLIC"], passport.authenticate('github', {scope: ['user:email']} ), async(req,res) =>{});
        // GITHUB LOGIN CALLBACK
        this.get('/githubcallback', ['PUBLIC'], passport.authenticate('github', { session: false, failureRedirect:'/github/error'} ),  UserController.userRegisterByGithub)



        
    } // fin de init
    

} // fin class UsersExtendRouter






