// import CustomRouter from './custom.routes.js';
// import passport from 'passport';
import UserService from "../services/db/user.service.js";
import { createHash, isValidPassword, generateJWToken } from "../utils.js";

const userService = new UserService();



/*=============================================
 =                    LOGIN                   =
=============================================*/
export const postLoginUserControllers = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.findByUsername(email);
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
    const tokenUser = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.carts,
    };
    const access_token = generateJWToken(tokenUser);
    console.log(":::: access_token ::::");
    console.log(access_token);

    // almacenando jwt en Cookies
    res.cookie("jwtCookieToken", access_token, {
      maxAge: 600000,
      httpOnly: true, //No se expone la cookie
    });
    res.sendSuccess({ access_token: access_token, id: user._id });
  } catch (error) {
    console.error(error);
    return res.sendInternalServerError({ error: "Internal Server Error" });
  }
};



/*=============================================
=                  REGISTER                  =
=============================================*/
export const postRegisterUserControllers = async (req, res) => {
  const { first_name, last_name, email, age, password, role } = req.body;
  console.log("Registrando usuario:");
  console.log(req.body);

  const exists = await userService.findByUsername(email);
  if (exists) {
    return res.sendClientError({ message: ` Usuario ${email} ya existe.` });
  }
  const user = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
    role,
  };
  const result = await userService.save(user);
  res.sendSuccess({
    message: "Usuario creado con extito con ID: " + result.id,
  });
};


 /*=============================================
=          GITHUB  CALLBACK LOGIN               =
=============================================*/
export const postLoginGitHubCallBackUserControllers = async (req, res) => {
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
export const getAllUsersDataControllers = async (req, res) => {
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



