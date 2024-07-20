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
        throw Error(error);
    } else {
        success
    }
})


/*=============================================
=                envio de email               =
=============================================*/
export const sendEmail = (req, res) => {
    try {
        transporter.sendMail((error, info) => { // el objeto info tiene toda la data sobre el mail enviado

            if (error) {
                req.logger.error("Error al enviar un email" + error);
                res.status(400).send({ message: "Error", payload: error });
            }
            //console.log('Message send: %s', info.messageId);
            res.send({ message: "Success", payload: info });
        })
    } catch (error) {
        req.logger.error("500: No se pudo enviar el email desde:" + config.gmailAccount );
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}

// enviar mail con opcion par adjuntar imagen en cuerpo
export const sendEmailWithAttachments = (req, res) => {
    try {
            transporter.sendMail((error, info) => {

            if (error) {
                req.logger.error("Error al enviar un email con archivos adjuntos" + error);
                res.status(400).send({ message: "Error", payload: error });
            }
            //console.log('Message send: %s', info.messageId);
            res.send({ message: "Success", payload: info });
        })
    } catch (error) {
        req.logger.error("500: No se pudo enviar el email desde:" + config.gmailAccount );
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
        // console.log(`Correo de confirmación de compra enviado a ${userEmail}`);
    } catch (error) {
        throw Error('Error al enviar el correo de confirmación de compra:', error);
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
        //console.log(`Correo de bienvenida enviado a ${userEmail}`);
    } catch (error) {
        throw Error('Error al enviar el correo de bienvenida:', error);
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
            req.logger.warning('400: Debe proveer un email valido');
            return res.status(400).send('Debe proveer un email valido')

        }
        const token = v4();
        const link = `http://localhost:8080/api/email/reset-password/${token}`;

        tempDbMails[token] = {
            email,
            expirationTime: new Date(Date.now() + 60 * 60 * 1000) // 1 hora
            //expirationTime: new Date(Date.now() + 1 * 60 * 1000) // *1 minuto para probar
            
        }

        //console.log(tempDbMails);

        mailOptionsToReset.html = `To reset your password, click on the following link: <a href="${link}">Reset Password</a>`


        transporter.sendMail(mailOptionsToReset, (error, info) => {
            if (error) {
                res.status(500).send({ message: "Error", payload: error });
                throw Error(error);
            }
            //console.log('Message sent: %s', info.messageId);
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        //console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}

export const resetPassword = (req, res) => {
    const token = req.params.token;
    const email = tempDbMails[token];
    req.logger.info(email);
    const now = new Date()
    const expirationTime = email?.expirationTime
    if (now > expirationTime || !expirationTime) {
        delete tempDbMails[token]
        req.logger.warning('expiration time completed');
        return res.redirect('/send-email-to-reset')
    }
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
        //console.log(`Correo de eliminación por inactividad enviado a ${userEmail}`);
    } catch (error) {
        throw Error('Error al enviar el correo de eliminación por inactividad:', error);
    }
};
