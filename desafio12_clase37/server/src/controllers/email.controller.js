import nodemailer from 'nodemailer';
import config from '../config/config.js';
import __dirname from '../utils.js';
import { v4 } from 'uuid'



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
    to: config.gmailAccount,
    subject: 'Correo de prueba CoderHouse 60220', 
    html: `<div>
                <h1>Test de envio de correos con Nodemailer!</h1>  
           </div>`, 
    attachments: [] 
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




/*=============================================
=                Restablecer Pass             =
=============================================*/

const mailOptionsToReset = {
    from: config.gmailAccount,
    to: config.gmailAccount,
    subject: 'Reset Password',
};
export const tempDbMails = {}



export const sendEmailToResetPassword = (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).send('Email not privided')
        }
        const token = v4();
        console.log(Date.now());
        const link = `http://localhost:8080/api/email/reset-password/${token}`;

        // Store the email and its expiration time
        //  60 * 60 * 1000: Esto representa una hora en milisegundos. Multiplicando 60 (segundos) por 60 (minutos) y luego por 1000 (milisegundos), obtenemos el equivalente a una hora en milisegundos.
        tempDbMails[token] = {
            email,
            expirationTime: new Date(Date.now() + 1 * 60 * 1000)
        }

        console.log(tempDbMails);

        mailOptionsToReset.html = `To reset your password, click on the following link: <a href="${link}">Reset Password</a>`


        transporter.sendMail(mailOptionsToReset, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send({ message: "Error", payload: error });
            }
            console.log('Message sent: %s', info.messageId);
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}




export const resetPassword = (req, res) => {
    const token = req.params.token;
    const email = tempDbMails[token];
    console.log(email);
    const now = new Date()
    const expirationTime = email?.expirationTime
    if (now > expirationTime || !expirationTime) {
        delete tempDbMails[token]
        console.log('expiration time completed');
        return res.redirect('/send-email-to-reset')
    }
    //res.send('<h1>Start Reset Password Process</h1>');
    res.render('reset-password',{
        token,
        title: "Reset Password" ,
        styleUser: "StyleUser.css",
      })
    //todo - redireccionar a vista para cambiar password
}