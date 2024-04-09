import { Router } from "express";
import { authorization, passportCall } from "../utils.js";


const router = Router();

//? aca solo van los renders para las plantillas handlebars

// la idea es que cuando el usuario se logee pueda ver los productos
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
    // todo: -- aca pdriamos iniciar el carrito?
});


//    '/user'
// Cuando ya tenemos una jwt activa con los datos del user, renderizamos la vista products
router.get("/", passportCall('jwt'), authorization('user'), (req, res) => {
//res.redirect('/user/profile')
res.redirect('/user/current-user')

  res.render('products',{
    title: "User | Products",
    user: req.user
  })
});



//router.get("/profile", passportCall('jwt'), authorization('user'), (req, res)=>{
router.get("/current-user", passportCall('jwt'), (req, res)=>{

  res.render('profile',{
    title: "Perfil" ,
    user: req.user
  })
});


router.get("/admin-user", passportCall('jwt'), authorization('admin'), (req, res)=>{

  res.render('admin',{
    title: "Admin" ,
    user: req.user
  })
});


router.get("/logout", passportCall('jwt'), (req, res) => {
  res.clearCookie('jwtCookieToken')
      res.render('logout',{
        title: "Logout" ,
        styleUser: "StyleUser.css",
      })
      console.log("LOGOUT EXITOSO")
});


// todo implementar esta vista
router.get("/error", (req, res)=>{
  res.render("error");
});






export default router;