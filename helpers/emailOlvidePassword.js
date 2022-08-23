import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
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
        subject: "Recupera tu cuenta de APV",
        text: "Crea un nuevo password",
        html: `<p>Hola ${nombre}, recupera tu cuenta en APV</p>
            <p>Puedes recuperar tu cuenta dando click al siguiente enlace
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Recuperar mi cuenta</a></p>
            <small>Si tu no fuiste, puedes ignorar este mensaje</small>
        `
    });

    console.log(`Mensaje enviado: %s`, info.messageId);
}

export default emailOlvidePassword;