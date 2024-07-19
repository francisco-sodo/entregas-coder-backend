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
        console.log('Server is ready to take our messages with Nodemailer');
    }
})


/*=============================================
=                   PROBANDO                  =
=============================================*/
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
            path: __dirname + '/public/assets/images/gatito.png',
            cid: 'gatito-random' // por medio de este id puedo pasar la imagen al cuerpo del html
        }
    ]
}

// APIS

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



/*=============================================
=            confirmacion de compra           =
=============================================*/
export const sendPurchaseConfirmationEmail = async (userEmail, ticket) => {
    try {
        const mailOptions = {
            from: config.gmailAccount, // e-commerce
            to: config.gmailAccount, // generar alguna cuenta destinataria para entrega
            subject: 'Confirmación de Compra',
            html: `<div>
                    <h3>Tu compra ha sido exitosa!</h3>
                    <p>Te enviamos el comprobante de tu compra:</p>
                    <p>Ticket Code: ${ticket.code}</p>
                    <ul>Productos:
                        ${ticket.products.map(product => `<li>${product.title}, Cantidad: ${product.quantity}</li>`).join('')}
                    </ul>
                    <p><strong>Monto Total: </strong> ${ticket.amount}</p>
                    <p>Comprador: ${ticket.purchaser}</p>
                    </div>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Correo de confirmación de compra enviado a ${userEmail}`);
    } catch (error) {
        console.error('Error al enviar el correo de confirmación de compra:', error);
    }
};


/*=============================================
=       Bienvenida a usuario registrado       =
=============================================*/

export const sendRegisterConfirmationEmail = async (userEmail, userName, userRole) => {
    let emailContent

    if (userRole === 'admin') {
        emailContent = `
            <h3>¡Bienvenido ${userName}!</h3>
            <p>Eres el administrador de esta tienda.</p>
        `;
    } else {
        emailContent = `
            <h3>¡Bienvenido ${userName}!</h3>
            <p>Ya puedes comenzar a comprar en nuestra tienda.</p>
        `;
    }

    try {
        const mailOptions = {
            from: config.gmailAccount, // e-commerce
            to: config.gmailAccount, // generar alguna cuenta destinataria para entrega
            subject: 'Bienvenido a nuestro E-commerce',
            html: emailContent
        };

        await transporter.sendMail(mailOptions);
        console.log(`Correo de bienvenida enviado a ${userEmail}`);
    } catch (error) {
        console.error('Error al enviar el correo de bienvenida:', error);
    }
};





/*=============================================
=                Restablecer Pass             =
=============================================*/

const mailOptionsToReset = {
    from: config.gmailAccount, // e-commerce
    to: config.gmailAccount, // generar alguna cuenta destinataria para entrega
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
        //console.log(Date.now());
        const link = `http://localhost:8080/api/email/reset-password/${token}`;

        tempDbMails[token] = {
            email,
            //expirationTime: new Date(Date.now() + 60 * 60 * 1000) // 1 hora
            expirationTime: new Date(Date.now() + 1 * 60 * 1000) // *1 minuto para probar
            
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

}




/*=============================================
=      Cuenta borrada por inactividad         =
=============================================*/
export const sendInactivityDeletionEmail = async (userEmail, userName) => {
    const emailContent = `
        <h3>Hola ${userName},</h3>
        <p>Tu cuenta ha sido eliminada debido a inactividad durante el último año.</p>
    `;

    try {
        const mailOptions = {
            from: config.gmailAccount,
            to: config.gmailAccount, // generar alguna cuenta destinataria para entrega
            subject: 'Cuenta Eliminada por Inactividad',
            html: emailContent
        };

        await transporter.sendMail(mailOptions);
        console.log(`Correo de eliminación por inactividad enviado a ${userEmail}`);
    } catch (error) {
        console.error('Error al enviar el correo de eliminación por inactividad:', error);
    }
};
