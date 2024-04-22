import CustomRouter from './custom.routes.js';
import passport from 'passport';
//import UserService from '../../services/db/user.service.js';
//import { createHash, isValidPassword, generateJWToken } from '../../utils.js';


import {
    postLoginUserControllers,
    postRegisterUserControllers,
    postLoginGitHubCallBackUserControllers,
    getAllUsersDataControllers
} from '../../controllers/users.controller.js'



export default class UsersExtendRouter extends CustomRouter {
    init() { 
        // inicializa todo el custom router.
       
        // con el this hacemos referencia al get de CustomRouter
        this.get("/", ["PUBLIC"], (req,res)=>{ //path,policies(PUBLIC),callbacks
            res.sendSuccess(req.user) // este es el payload
        }) 

      
        this.get("/current-user", ["USER", "ADMIN", "PREMIUM"], (req, res) => {
            res.sendSuccess(req.user);
        });


        this.get("/admin-user", ["ADMIN"], (req, res) => {
           res.sendSuccess(req.user);
          
        });


   
    

        
        // LOGIN
        this.post('/login', ['PUBLIC'], postLoginUserControllers)

        // REGISTER
        this.post('/register', ['PUBLIC'], postRegisterUserControllers)


        // GITHUB LOGIN
        // endpoint para API de estrategia de login con github (passport.config)
        this.get('/github', ["PUBLIC"], passport.authenticate('github', {scope: ['user:email']} ), async(req,res) =>{});
        // GITHUB LOGIN CALLBACK
        this.get('/githubcallback', ['PUBLIC'], passport.authenticate('github', { session: false, failureRedirect:'/github/error'} ),  postLoginGitHubCallBackUserControllers)

        


        // GET ALL USERS
        this.get('/all',["PUBLIC"],getAllUsersDataControllers)



        
    } // fin de init
    

} // fin class UsersExtendRouter






