import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;
    //enviar email
    const info = await transporter.sendMail({
        from: "APV - Administrador de pacientes de veterinaria",
        to: email,
        subject: "Comprueba tu cuenta en APV",
        text: "Comprueba tu cuenta en APV",
        html: `<p>Hola ${nombre}, comprueba tu cuenta en APV</p>
            <p>Tu cuenta ya esta creada, solo debes comprobar dando click al siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a></p>
            <small>Si tu no creaste esta cuenta, puedes ignorar este mensaje</small>
        `
    });

    console.log(`Mensaje enviado: %s`, info.messageId);
}

export default emailRegistro;