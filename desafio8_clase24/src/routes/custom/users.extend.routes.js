import CustomRouter from './custom.routes.js';
import passport from 'passport';
import UserService from '../../services/db/user.service.js';
import { createHash, isValidPassword, generateJWToken } from '../../utils.js';


export default class UsersExtendRouter extends CustomRouter {
    init() { 
        // inicializa todo el custom router.
        // Todas las req/res van dentro de este init()

        const userService = new UserService();

        // con el this hacemos referencia al get de CustomRouter
        this.get("/", ["PUBLIC"], (req,res)=>{ //path,policies(PUBLIC),callbacks
            res.sendSuccess(req.user) // este es el payload
        }) 

        // currentUser = el perfil del usuario
        this.get("/current-user", ["USER", "USER_PREMIUM"], (req, res) => {
            res.sendSuccess(req.user);
        });


        this.get("/premium-user", ["USER_PREMIUM"], (req, res) => {
            res.sendSuccess(req.user);
        });

        this.get("/admin-user", ["ADMIN"], (req, res) => {
           
            res.sendSuccess(req.user);
        
        });



        /*=============================================
        =                    LOGIN                    =
        =============================================*/
        this.post("/login", ['PUBLIC'], async (req, res) => { //cualquier persona se puede loguear
            const { email, password } = req.body;
            try {
                const user = await userService.findByUsername(email);
                console.log("Usuario encontrado para login:");
                console.log(user);
                if (!user) {
                    console.warn("User doesn't exists with username: " + email);
                    return res.status(202).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
                }
                if (!isValidPassword(user, password)) {
                    console.warn("Invalid credentials for user: " + email);
                    return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
                }
                const tokenUser = {
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    age: user.age,
                    role: user.role,
                    cart: user.carts
                };
                const access_token = generateJWToken(tokenUser);
                console.log(':::: access_token ::::');
                console.log(access_token);

                // almacenando jwt en Cookies
                res.cookie('jwtCookieToken', access_token,
                {
                    maxAge: 600000, //10 min
                    httpOnly: true //No se expone la cookie
                })
                
                //res.sendSuccess({access_token:access_token, id:user._id})
                res.send({ message: "Login successful!", access_token: access_token, id: user._id });
               


            } catch (error) {
                console.error(error);
                return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });
            }
        });




        /*=============================================
        =                  REGISTER                  =
        =============================================*/
        this.post("/register", ["PUBLIC"], async (req, res) => {
            const { first_name, last_name, email, age, password} = req.body;
            console.log("Registrando usuario:");
            console.log(req.body);

            const exists = await userService.findByUsername(email);
            if (exists) {
                return res.status(400).send({ status: "error", message: "Usuario ya existe." });
            }
            const user = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            };
            const result = await userService.save(user);
            res.status(201).send({ status: "success", message: "Usuario creado con extito con ID: " + result.id });
        });


        
    
        
        /*=============================================
        =               GITHUB LOGIN                  =
        =============================================*/
    
        //? endpoint para API de estrategia de login con github (passport.config)
        this.get('/github', ["PUBLIC"], passport.authenticate('github', {scope: ['user:email']} ), async(req,res) =>{});
    
        //? github passport callback
        //http://localhost:8080/api/extend/users/githubcallback
        this.get('/githubcallback', ["PUBLIC"], passport.authenticate('github', { session: false, failureRedirect:'/github/error'} ), async (req,res) =>{
            //creamos la sesion y redireccionamos a api/users
            const user = req.user
    
            // con JWT
            const tokenUser = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                role: user.role,
                cart: user.carts
            };
            const access_token = generateJWToken(tokenUser);
            console.log(access_token);
    
            res.cookie('jwtCookieToken', access_token,
                {
                    maxAge: 600000,
                    httpOnly: true //No se expone la cookie
                }
            )
            // res.redirect('/users')
            res.redirect("/products");
        })











    } // fin de init
    

} // fin class UsersExtendRouter