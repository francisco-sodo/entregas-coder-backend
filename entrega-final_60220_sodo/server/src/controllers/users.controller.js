
import { createHash, isValidPassword, generateJWToken } from "../utils.js";
import { userService, cartService } from "../services/service.js";
import { tempDbMails, sendRegisterConfirmationEmail, sendInactivityDeletionEmail } from "./email.controller.js";
import {UsersDto} from "../services/dto/user.dto.js";
import {UsersDtoSmall} from "../services/dto/user.dto.js";


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
          req.logger.error(`El usuario ${email} ya existe.`);
          return res.sendClientError({ message: `El usuario ${email} ya existe.` });
          
      }

      
      
      // Crear un objeto de usuario usando el DTO
      const userDto = new UsersDto({
          first_name,
          last_name,
          email,
          age,
          password: createHash(password),
          role,
      });

      // Crear un carrito para el usuario siempre y cuando no sea un admin.
      const userCart = await cartService.create();

      if(userDto.role !== "admin"){
        userDto.cart = userCart
      }

      // Crear el usuario utilizando el servicio de usuarios
      const result = await userService.create(userDto);
      console.log("usuario creado::::::"+result)

      // Enviar correo de bienvenida
      await sendRegisterConfirmationEmail(email,first_name,role);

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
    // console.log("Usuario encontrado para login+++:");
    // console.log(user);
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


    const loginDate = new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });

    const updatedUser = await userService.update(
      { _id: user._id },
      { last_connection: loginDate }
    );

    const tokenUser = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart,
      last_connection: updatedUser.last_connection, 
    };
   
    const access_token = generateJWToken(tokenUser);
    // console.log(":::: access_token ::::");
    // console.log(access_token)

    // almacenando jwt en Cookies
    res.cookie("jwtCookieToken", access_token, {
      maxAge: 900000, // 15 minutos
      httpOnly: true, //No se expone la cookie
    });
    res.sendSuccess({ access_token: access_token, id: user._id, cart: user.cart, last_connection: loginDate });

    console.log(":::: USUARIO LOGUEADO :::: >>>> LOGINTDATE: ",loginDate);
    console.log(tokenUser)



  } catch (error) {
    console.error(error);
    return res.sendInternalServerError({ error: "Internal Server Error" });
  }
};



 /*=============================================
=          GITHUB  CALLBACK LOGIN               =
=============================================*/
export const userRegisterByGithub = async (req, res) => {
  
  const user = req.user;
  
  try {

    //con JWT
  const tokenUser = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    role: user.role,
    // cart: user.cart,
    };
    const userCart = await cartService.create();
    if(tokenUser.role !== "admin"){
      tokenUser.cart = userCart
       //userCart = tokenUser.cart
    }
    

    //console.log("TOKEN USER", tokenUser)

  const access_token = generateJWToken(tokenUser);

  res.cookie("jwtCookieToken", access_token, {
    maxAge: 900000, // 15 minutos
    httpOnly: true, //No se expone la cookie
  });
  res.redirect("/products");

    
  } catch (error) {
    console.error(error);
    return res.sendInternalServerError({ error: "Internal Server Error" });
  }
};


  


/*=============================================
 =                    LOGOUT                  =
=============================================*/
export const userLogout = async (req, res) => {

  const user = req.user
  //console.log('<<<<<<<<<<<<<????????????????<<<<<<<<<<<<<<<<', user.email)

  try {

    const logoutDate = new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });

    const updatedUser = await userService.update({email: user.email},{ last_connection: logoutDate });
    updatedUser.last_connection = logoutDate

    if (!updatedUser) {
      throw new Error("No se pudo actualizar la última conexión del usuario");
    }

    res.clearCookie('jwtCookieToken');

    console.log('LOGOUTDATE', updatedUser.last_connection)
    //console.log('<<<<<<<<<<<<<????????????????<<<<<<<<<<<<<<<<', updatedUser.user)


    res.status(200).send({ message: "¡Sesión cerrada correctamente!", last_connection: updatedUser.last_connection});
    
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Error interno del servidor al cerrar sesión." });
  }
};



/*=============================================
=      DELETE INACTIVE USERS (rol user)        =
=============================================*/
export const deleteInactiveUsers = async (req, res) => {
  try {
      const currentDate = new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
      const parsedDate = new Date(currentDate)
      const timeToDeleteInactiveUser = new Date(parsedDate.setFullYear(parsedDate.getFullYear() - 1)); // 1 año y se borra la cuenta
      //const timeToDeleteInactiveUser = new Date(parsedDate.getTime() - (10 * 60 * 1000)); //* 10 minutos para probar


      const inactiveUsers = await userService.getInactiveUsers(timeToDeleteInactiveUser);

      const inactiveUserRole = inactiveUsers.filter(user => user.role === 'user');

      for (const user of inactiveUserRole) {
          await sendInactivityDeletionEmail(user.email, user.first_name);
          await userService.delete(user._id);
      }

      res.sendSuccess({ message: 'Usuarios inactivos eliminados correctamente.' });
  } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
      res.sendInternalServerError({ error: 'Error interno del servidor' });
  }
};







/*=============================================
=                RESET PASSWORD               =
=============================================*/


export const resetPass = async (req, res) => {
  try {
    const { token, email, password } = req.body;
    const userEmail = tempDbMails[token];
    console.log('USER EMAIL @@@@@@',userEmail)

    if (!userEmail || userEmail.email !== email) {
      return res.status(400).send({ message: "Invalid or expired token." });
    }

    // Delete the token from temporary storage
    delete tempDbMails[token];

    const user = await userService.getByUserName(email);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Actualiza la contraseña
    const updatedUser = {
      ...user.toObject(),
      password: createHash(password)
      };
    
    await userService.update({ email }, updatedUser);

    
    res.sendSuccess({ message: "Password reset successfully." });
     

   
  } catch (error) {
      console.error(error);
      res.sendInternalServerError({ error: "Error interno del servidor" });
  }
};



 /*=============================================
=                 ALL USERS                   =
=============================================*/
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userService.getAll();
    if (!allUsers)
      return res.status(202).send({ error: "No hay usuarios para mostrar" });

     // Crear un objeto de usuario usando el DTO
     const usersDto = allUsers.map(user => new UsersDtoSmall(user));

    res.sendSuccess(usersDto);
    console.log("TOTAL DE USUARIOS: " + usersDto.length);
    
  } catch (error) {
    return res
      .status(500)
      .send({ status: "error", error: "Error interno de la applicacion." });
  }
};


/*=============================================
=               USER BY ID                    =
=============================================*/
export const getUserById = async (req, res) => {
  let { uid } = req.params
  try {
    const userId = await userService.getById(uid);
    if (!userId){
      return res.status(202).send({ error: "El usuario que buscas no existe" });
    } else{
      res.sendSuccess({
        _id: userId._id,
        name: `${userId.first_name} ${userId.last_name}`,
        email: userId.email,
        role: userId.role,
        last_connection: userId.last_connection, 
      })
    }
  } catch (error) {
    return res
      .status(500)
      .send({ status: "error", error: "Error interno de la applicacion." });
  }
};


/*=============================================
=            UID-> UPLOAD FILES               =
=============================================*/
export const uploadFiles = async (req, res) => {
  const { uid } = req.params;
  const files = req.files;
  const userId = await userService.getById(uid);
  
  try {

    if (!files) {
      return res.status(400).send({ status: "error", error: "No ha cargado ningun archivo" });
    }
    console.log('ARCHIVOS:', files); 
    
    if (!userId) {
      return res.status(404).send({ status: "error", error: "Usuario no encontrado" });
    }

    const updatedDocuments = [];

    files.forEach(file => {
      updatedDocuments.push({ name: file.fieldname, reference: file.filename, size: file.size});
    });


    //console.log('ARCHIVOS SUBIDOS:', updatedDocuments); 
    
    await userService.update(
      { _id: userId },
      { $push: { documents: { $each: updatedDocuments } } }
    );

    //saber que archivos se subieron
    const uploadedFilesType = updatedDocuments.map(doc => ({fileType: doc.name}));

    res.status(200).send({ status: "success", message: "Archivos subidos con exito", documents: updatedDocuments, uploadedBy: userId.email, uploadedFilesType: uploadedFilesType });
    
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: "error", error: "Error interno del servidor." });
  }
};






/*=============================================
 =        switch rol user <-> premium         =
=============================================*/
export const switchRolUser = async (req, res) => {

  let { uid } = req.params;

  try {
    
    const user = await userService.getById(uid);
    //console.log('USERRRRRRRRR', user)
    //console.log('USERRDOCUMENTS', user.documents)
    if (!user) {
        return res.status(404).send({ message: `Usuario con ID ${uid} no encontrado.` });
    }

    if (user.role === 'user') {

      // Verificacion de documentos requeridos
      const requiredDocuments = ['identification', 'address', 'account-status'];
      const uploadedDocuments = user.documents.map(doc => doc.name);

      const missingDocuments = requiredDocuments.filter(doc => !uploadedDocuments.includes(doc));

      if (missingDocuments.length > 0) {
        return res.status(400).send({
          message: `El usuario no ha terminado de cargar la documentación requerida. Faltan los siguientes documentos: ${missingDocuments.join(', ')}.`
        });
      }
      // si cumple con los requisitos, se cambia a premium.
      user.role = 'premium';

    } else if (user.role === 'premium') {
      user.role = 'user';
    }

    const updatedUser = await userService.update({ _id: uid }, user);
    res.sendSuccess({ message: `Rol de usuario con ID ${uid} cambiado a ${user.role}.`, payload: updatedUser });

   
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};





