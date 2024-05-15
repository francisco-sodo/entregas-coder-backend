import nodemailer from 'nodemailer';
import config from '../config/config.js';
import __dirname from '../utils.js';



/*=============================================
=        configuraciones NODEMAILER           =
=============================================*/


// Configuracion de nodemailer - transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
})

// verificamos que los datos que estoy pasando a Nodemailer estan ok
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
})



//configuracion del mail (para limpiar el codigo en las apis)
const mailOptions = {
    from: "Coder Test - " + config.gmailAccount,
    to: config.gmailAccount, // mi cuenta solo para testear. esto deberia ser dinamico
    subject: 'Correo de prueba CoderHouse 60220', // deberia ser dinamico
    html: `<div><h3> Test de envio de correos con Nodemailer! </h3></div>`, // deberia ser dinamico
    attachments: [] // deberia ser dinamico
}

// configuracion para enviar un adjunto, con opcion par adjuntar imagen en cuerpo
const mailOptionsWithAttachments = {
    from: "Coder Test - " + config.gmailAccount,
    to: config.gmailAccount,
    subject: 'Correo de prueba CoderHouse 60220',
    html: ` <div>
                <h1>Test de envio de correos con Nodemailer!</h1>
                <p>Ahora usando imagenes: </p>
                <img src="cid:gatito-random"/> 
            </div>`,
    attachments: [
        {
            filename: "gatito",
            path: __dirname + '/public/images/gatito.png',
            cid: 'gatito-random' // por medio de este id puedo pasar la imagen al cuerpo del html
        }
    ]
}



/*=============================================
=                    APIS                     =
=============================================*/

// enviar mail
export const sendEmail = (req, res) => {
    try {
        transporter.sendMail(mailOptions, (error, info) => { // el objeto info tiene toda la data sobre el mail enviado
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error });
            }
            console.log('Message send: %s', info.messageId);
            res.send({ message: "Success", payload: info });
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}

// enviar mail con opcion par adjuntar imagen en cuerpo
export const sendEmailWithAttachments = (req, res) => {
    try {
        transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error });
            }
            console.log('Message send: %s', info.messageId);
            res.send({ message: "Success", payload: info });
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}



//? SE PUEDE APLICAR PARA MANDAR COMPROBANTE (TICKET) AL USUARIO DESPUES DE UNA COMPRA.