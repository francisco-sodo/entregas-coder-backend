import dotenv from "dotenv";
import program from "../process.js";

// capturamos la option gracias a commander por consola, con los flags. Ej, --mode development. 
const environment = program.opts().mode;


// este levanta los .env dentro de la carpeta config.
// si el ambiente esta en production, levanta el env.production. Si no, levanta el env.development
dotenv.config({
    path: environment === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
});


export default { // esto lo va a consumir app.js
    port: process.env.SERVER_PORT,
    mongoUrl: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    githubCallbackURL: process.env.GITHUB_CALLBACK_URL,
    jwtPrivateKey: process.env.PRIVATE_KEY,
    cookieParser: process.env.COOKIE_PARSER
}