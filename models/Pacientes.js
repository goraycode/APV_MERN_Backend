import mongoose from "mongoose";
const pacienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true
    },
    propietario: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    fecha: {
        type: Date,
        require: true,
        default: Date.now()
    },
    sintomas: {
        type: String,
        require: true
    },
    veterinario: {
        /* para saber quien atendio a tal persona  
        ref sirve para traernos los demás datos
        y tiene como valor el nombre del modelo*/
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veterinario"
    }


},
    //para que nos cree las columna de creado y editado
    {
        timestamps: true
    }
);


const Paciente = mongoose.model('Paciente', pacienteSchema);
export default Paciente;