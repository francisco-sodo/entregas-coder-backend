import dotenv from "dotenv";
import program from "../process.js";

const environment = program.opts().mode;

dotenv.config({
    path: environment === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
});

export default { 
    port: process.env.SERVER_PORT,
    mongoUrl: process.env.MONGO_URL,
    mongoUrlTest: process.env.MONGO_URL_TEST,
    persistence: program.opts().persist,
    environment: environment,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    githubCallbackURL: process.env.GITHUB_CALLBACK_URL,
    jwtPrivateKey: process.env.PRIVATE_KEY,
    cookieParser: process.env.COOKIE_PARSER,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD
}