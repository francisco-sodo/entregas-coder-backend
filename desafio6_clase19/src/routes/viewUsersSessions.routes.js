import { Router } from "express";

const router = Router();

//? aca solo van los renders para las plantillas handlebars

// la idea es que cuando el usuario se logee pueda ver los productos
router.get("/login", (req, res) => {
  res.render('login')
});

router.get("/register", (req, res) => {
    res.render('register')
    // todo: -- aca pdriamos iniciar el carrito?
});

// Cuando ya tenemos una session activa con los datos del user, renderizamos la vista products
router.get("/", (req, res) => {
let userSession = req.session.user

  if(!userSession){
    res.render('login')

  } else{
  res.render('products')
    // obtenemos los datos del user desde la session. Si ya entro en session, es porque se logueo, y ahi si podemos ver sus datos (perfil)
    //user: req.session.user 
    // todo: --  o aca pdriamos iniciar el carrito?
  }
});


router.get("/profile", (req, res)=>{
  let user = req.session.user
  console.log(user)
  res.render("profile", {
    user
  });
});


router.get("/logout", (req, res) => {
  req.session.destroy(error => {
      if (error){
          res.json({error: "error logout", mensaje: "Error al cerrar la sesion"});
      }
      res.render('logout')
      
  });
});


// todo implementar esta vista
router.get("/error", (req, res)=>{
  res.render("error");
});






export default router;