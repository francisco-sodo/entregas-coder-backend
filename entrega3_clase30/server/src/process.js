import { Command } from "commander";
// import dotenv from "dotenv";


const program = new Command(); //Crea la instancia de comandos de commander.



program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del Server', 8080)
    .option('--mode <mode>', 'Modo de trabajo del Server', 'development')
    .option('--persist <mode>', 'Modo de persistencia', 'mongodb')
program.parse() // paesea los comando y valida si son correctos. Cierra.


// dotenv.config();

console.log('Option:', program.opts());// accedo a todos los options
console.log('Port:', program.opts().p);
console.log('Environment:', program.opts().mode);// esto lo voy a usar en config.js
console.log('Persistence:', program.opts().persist);

// LISTENERS. Metodos de escucha para eventos de process (node server)
// al salir del proceso
process.on('exit', code=>{
    console.log("Este codigo se ejecuta antes de salir del proceso.");
    console.log("Codigo de salida del process. ", code);
})

//un evento de escucha del PROCESS para capturar excepciones de errores que por alguna razon(excepcion) no se hayan controlado y asi evitar que se rompa la app.
process.on('uncaughtException', exception => {
    console.log("Esta exception no fue capturada, o controlada.");
    console.log("Exception no capturada: ", exception);
})
// capturar un nensaje de otro proceso
process.on('message', message => {
    console.log("Este codigo se ejecutará cuando reciba un mensaje de otro proceso.");
    console.log(`Mensaje recibido: ${message}`);
})


export default program; // lo exporto para consumir en config.js