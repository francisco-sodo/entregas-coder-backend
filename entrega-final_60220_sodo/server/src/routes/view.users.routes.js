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
      req.logger.info("LOGOUT EXITOSO");
});





router.get("/current", passportCall('jwt'),authorization('admin','user','premium'), (req, res)=>{

  let role = req.user.role;

  if (role === 'admin') {
    res.redirect("/user/current/admin");
  } else if (role === 'premium') {
    res.redirect("/user/current/premium");
  } else {
    res.redirect("/user/current/user");
  }
});

router.get("/current/premium", passportCall('jwt'), authorization('premium'), (req, res)=>{
  res.render('profile',{
    title: "Premium",
    profileStyle: "StyleProfile.css",
    user: req.user,
    role: req.user.role,
    isAdmin: req.user.role === 'admin',
    isUser: req.user.role === 'user',
    isPremium: req.user.role === 'premium',
  })
});

router.get("/current/admin", passportCall('jwt'), authorization('admin'), (req, res)=>{
    res.render('profile',{
      title: "Admin",
      profileStyle: "StyleProfile.css",
      user: req.user,
      role: req.user.role,
      isAdmin: req.user.role === 'admin',
      isUser: req.user.role === 'user',
      isPremium: req.user.role === 'premium',
    })
});

router.get("/current/user", passportCall('jwt'), authorization('user'), (req, res)=>{
  res.render('profile',{
    title: "User",
    profileStyle: "StyleProfile.css",
    user: req.user,
    role: req.user.role,
    isAdmin: req.user.role === 'admin',
    isUser: req.user.role === 'user',
    isPremium: req.user.role === 'premium',
  })
});


// todo-  implementar esta vista
// router.get("/error", (req, res)=>{
//   res.render("error");
// });



export default router;









