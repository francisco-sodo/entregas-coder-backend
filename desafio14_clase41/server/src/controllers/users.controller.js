
import { createHash, isValidPassword, generateJWToken } from "../utils.js";
import { userService } from "../services/service.js";
import { cartService } from "../services/service.js";

import UsersDto from "../services/dto/user.dto.js";


// errors handler
import CustomError from '../services/errors/CustomError.js';
import EErrors from "../services/errors/errors-enum.js";
import { generateUserErrorInfoESP , generateUserErrorInfoENG} from "../services/errors/messages/user-creation-error-messages.js";





/*=============================================
=                  REGISTER                  =
=============================================*/


export const userRegister = async (req, res) => {
  try {
      const { first_name, last_name, email, age, password, role } = req.body;


      //? error handler
     if(!first_name || !email || !password){
     
      CustomError.createError({
          name:"User creation Error",
          cause:generateUserErrorInfoESP({first_name, email, password}),
          message:"Error tratando de crear un usuario.",
          code: EErrors.INVALID_TYPES_ERROR
      })
  }


      // Verificar si el usuario ya existe
      const exists = await userService.getByUserName(email);
      if (exists) {
          return res.sendClientError({ message: `El usuario ${email} ya existe.` });
      }

      // Crear un carrito para el usuario
      const userCart = await cartService.create();
      
      // Crear un objeto de usuario usando el DTO
      const userDto = new UsersDto({
          first_name,
          last_name,
          email,
          age,
          password: createHash(password),
          role,
          cart: userCart._id // Asignar el ID del carrito al usuario
      });

      // Crear el usuario utilizando el servicio de usuarios
      const result = await userService.create(userDto);
      console.log("usuario creado::::::"+result)
      res.sendSuccess({
          message: "Usuario creado exitosamente con ID: " + result.id,
      });

  } catch (error) {
      console.error(error);
      res.sendInternalServerError({ error: "Error interno del servidor" });
  }
};




/*=============================================
 =                    LOGIN                   =
=============================================*/
export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getByUserName(email);
    console.log("Usuario encontrado para login:");
    console.log(user);
    if (!user) {
      console.warn("User doesn't exists with username: " + email);

      return res.sendNotFoundResource({
        message: "Usuario no encontrado con username: " + email,
      });
    }
    if (!isValidPassword(user, password)) {
      console.warn("Invalid credentials for user: " + email);
      return res.sendUnauthorizedError({
        error: "User not authenticated or missing token.",
      });
    }

    //console.log(user, " ++++++++++++++++++++")


    const tokenUser = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart,
    };
    const access_token = generateJWToken(tokenUser);
    console.log(":::: access_token ::::");
    console.log(access_token);

    // almacenando jwt en Cookies
    res.cookie("jwtCookieToken", access_token, {
      maxAge: 600000,
      httpOnly: true, //No se expone la cookie
    });
    res.sendSuccess({ access_token: access_token, id: user._id, cart: user.cart });

  } catch (error) {
    console.error(error);
    return res.sendInternalServerError({ error: "Internal Server Error" });
  }
};



 /*=============================================
=          GITHUB  CALLBACK LOGIN               =
=============================================*/
export const userRegisterByGithub = async (req, res) => {
  //creamos la sesion y redireccionamos a api/users
  const user = req.user;

  //con JWT
  const tokenUser = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    role: user.role,
    cart: user.carts,
  };
  const access_token = generateJWToken(tokenUser);
  console.log(access_token);

  res.cookie("jwtCookieToken", access_token, {
    maxAge: 600000,
    httpOnly: true, //No se expone la cookie
  });
  res.redirect("/products");
};



 /*=============================================
=               ALL USERS                  =
=============================================*/
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userService.getAll();
    if (!allUsers)
      return res.status(202).send({ error: "No hay usuarios para mostrar" });

    res.sendSuccess(allUsers);
    console.log("TOTAL DE USUARIOS: " + allUsers.length);
  } catch (error) {
    return res
      .status(500)
      .send({ status: "error", error: "Error interno de la applicacion." });
  }
};





/*=============================================
 =                    LOGOUT                  =
=============================================*/


export const userLogout = async (req, res) => {


  try {
    // Eliminar la cookie del token JWT
   res.clearCookie('jwtCookieToken');
  

    // Enviar respuesta de éxito
    res.status(200).json({ message: `¡Sesión cerrada correctamente!` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor al cerrar sesión." });
  }
};

