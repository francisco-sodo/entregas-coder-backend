import { Router } from "express";
import { authorization, passportCall } from "../utils.js";


const router = Router();




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

router.get("/logout", (req, res) => {
  res.clearCookie('jwtCookieToken')
      res.render('logout',{
        title: "Logout" ,
        styleUser: "StyleUser.css",
      })
      console.log("LOGOUT EXITOSO")
});




// Cuando ya tenemos una jwt activa con los datos del user, renderizamos la vista current
// router.get("/", passportCall('jwt'), (req, res) => {

// });


router.get("/current", passportCall('jwt'), (req, res)=>{

  let role = req.user.role;

  if(role === 'admin'){
    res.redirect("/user/current/admin")
  }

  if(role === 'premium'){
      res.redirect("/user/current/premium")
    
  } else{
    res.redirect("/user/current/user")
  }
});





router.get("/current/admin", passportCall('jwt'), authorization('admin'), (req, res)=>{
    res.render('profile',{
      title: "Admin" ,
      user: req.user,
      role: req.user.role,
    })
});

router.get("/current/user", passportCall('jwt'), authorization('user'), (req, res)=>{
  // let cart = req.user.cart
  // console.log("CAAAARRTTTT:::::"+cart)
  res.render('profile',{
    title: "User" ,
    user: req.user,
    role: req.user.role,
    // cart
  })

  router.get("/current/premium", passportCall('jwt'), authorization('premium'), (req, res)=>{
    res.render('profile',{
      title: "Premium" ,
      user: req.user,
      role: req.user.role,
    })
});
});





// todo-  implementar esta vista
router.get("/error", (req, res)=>{
  res.render("error");
});






export default router;









