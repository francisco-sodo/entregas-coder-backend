import { Router } from "express";
import { authorization, passportCall } from "../utils.js";


const router = Router();

//? aca solo van los renders para las plantillas handlebars


router.get("/login", (req, res) => {
  res.render('login',{
    title: "Login" ,
    styleUser: "StyleUser.css",
  })
});

router.get("/register", (req, res) => {
    res.render('register',{
      title: "Register" ,
      styleUser: "StyleUser.css",
    })
   
});


// Cuando ya tenemos una jwt activa con los datos del user, renderizamos la vista products
router.get("/", passportCall('jwt'), (req, res) => {
//res.redirect('/user/current-user')

  res.render('products',{
    title: "User | Products",
    user: req.user
  })
   // todo: -- aca podria iniciar carrito?
});



router.get("/current-user", passportCall('jwt'), (req, res)=>{
  res.render('profile',{
    title: "Perfil" ,
    user: req.user
  })
});


router.get("/admin-user", passportCall('jwt'), authorization('admin'), (req, res)=>{
    res.render('admin',{
      title: "Admin" ,
      user: req.user,
    })
});


router.get("/logout", (req, res) => {
  res.clearCookie('jwtCookieToken')
      res.render('logout',{
        title: "Logout" ,
        styleUser: "StyleUser.css",
      })
      console.log("LOGOUT EXITOSO")
});


// todo-  implementar esta vista
router.get("/error", (req, res)=>{
  res.render("error");
});






export default router;