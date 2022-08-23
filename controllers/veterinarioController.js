import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {

    const { nombre, email, password } = req.body;
    //Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({ email });

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {

        //guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //enviar email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado);
    } catch (error) {

        console.error(`Error: ${error}`);
    }

}

const perfil = (req, res) => {
    const { veterinario } = req;
    res.json(veterinario);
}

const confirmar = async (req, res) => {
    //cuando leemos datos de un parametro se lee con req.params
    //console.log(req.params)
    //podemos acceder a estos valores haciendo destructuring 

    //igual al nombre puesto en el route
    const { token } = req.params;

    const usuarioConfirmado = await Veterinario.findOne({ token });

    if (!usuarioConfirmado) {
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }

    try {
        //traemos al usuario con ese token y actulizamos sus atributos
        usuarioConfirmado.token = null;
        usuarioConfirmado.confirmado = true;
        await usuarioConfirmado.save();

        res.json({ msg: "Cuenta confirmada exitosamente" });

    } catch (error) {
        console.log(error)
    }

}

const autenticar = async (req, res) => {
    /* Comprobamos de que su correo este confirmado y su contraseña 
        sea la correcta
    */

    const { email, password } = req.body;
    const usuarioAutenticado = await Veterinario.findOne({ email });
    if (!usuarioAutenticado) {
        const error = new Error('Usuario no existe');
        return res.status(403).json({ msg: error.message });
    }
    try {


        if (!usuarioAutenticado.confirmado) {
            const error = new Error('Tu cuenta no ha sido confirmada');
            return res.status(400).json({ msg: error.message });
        }

        //revisar el password
        if (await usuarioAutenticado.comprobarPassword(password)) {
            //autenticar
            usuarioAutenticado.token = generarJWT(usuarioAutenticado.id);
            res.json({
                _id: usuarioAutenticado.id,
                nombre: usuarioAutenticado.nombre,
                email: usuarioAutenticado.email,
                telefono: usuarioAutenticado.telefono,
                web: usuarioAutenticado.web,
                token: generarJWT(usuarioAutenticado.id)
            });
        } else {
            const error = new Error('Password incorrecto');
            return res.status(403).json({ msg: error.message });
        }



    } catch (error) {

        console.log(error)
    }

}


const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const existeVeterinario = await Veterinario.findOne({ email });

    if (!existeVeterinario) {
        const error = new Error('Usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    //enviamos token
    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        //enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        });

        res.json({ msg: "Se ha enviado a tu email las instrucciones" })
    } catch (error) {
        console.log(error)
    }


}

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({ token });
    if (!tokenValido) {
        const error = new Error('Token no válido');
        return res.status(400).json({ msg: error.message });
    }

    res.json({ msg: "Token válido el usuario existe" })

}

const nuevoPassword = async (req, res) => {
    //actualizar el password
    const { password } = req.body; //obtenemos el password nuevo
    const { token } = req.params;

    const veterinario = await Veterinario.findOne({ token });
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {

        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: "Password actualizado exitosamente" });

    } catch (error) {
        console.log(error)
    }
}

const actualizarPerfil = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, web } = req.body;


    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.msg });
    }

    if (veterinario.email !== email) {
        const existeEmail = await Veterinario.findOne({ email });
        if (existeEmail) {
            const error = new Error('Ese email ya esta registrado');
            return res.status(400).json({ msg: error.msg });
        }
    }


    try {
        veterinario.nombre = nombre;
        veterinario.email = email;
        veterinario.telefono = telefono;
        veterinario.web = web;
        await veterinario.save();
        res.json({ msg: "Actualización de usuario exitosa" });
    } catch (error) {
        console.log(error);
    }

}

const actualizarPassword = async (req, res) => {

    const { _id } = req.veterinario;
    const { password_actual, password_nuevo } = req.body;

    const veterinario = await Veterinario.findById(_id);
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.msg });
    }

    try {
        //comprobar el password actual sea correcto
        if (await veterinario.comprobarPassword(password_actual)) {
            veterinario.password = password_nuevo;
            await veterinario.save();
            res.json({ msg: "Password almacenado correctamente" });
        } else {
            const error = new Error('Password actual incorrecto');
            return res.status(400).json({ msg: error.msg });
        }
    } catch (error) {
        console.error(error)
    }


}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}