import mongoose from "mongoose";
import bcrypt from "bcrypt"; //es una libreria para validar y hashear el password
import generarId from "../helpers/generarId.js";

//creamos el schema de la base de datos
const veterinarioSchema = mongoose.Schema({

    nombre: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    }

});

//hashear el password antes de almacenar
veterinarioSchema.pre('save', async function (next) {

    //si el usuario cambia su password evitamos que se vuelva a hashear y asi evitar que el usuario no pueda ingresar

    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Comprobar si el usuario escribio correctamente su contraseña
veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
}




/* para registrarlo en mongoose pasamos como argumento el nombre y
el esquema de la base de datos y con ese nombre se guardará como collection 
*/
const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default Veterinario;