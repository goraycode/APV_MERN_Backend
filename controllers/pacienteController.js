import Paciente from "../models/Pacientes.js";

const agregarPaciente = async (req, res) => {
    try {

        const paciente = new Paciente(req.body);
        //almacenamos el id del veterinario quien registra a los pacientes
        paciente.veterinario = req.veterinario.id

        const pacienteGuardado = await paciente.save();
        res.json({ pacienteGuardado });
    } catch (error) {
        console.log(error)
    }

}
const obtenerPacientes = async (req, res) => {
    //listamos todos los pacientes de la base de datos
    const pacientes = await Paciente.find().
        where('veterinario').
        equals(req.veterinario);

    res.json(pacientes);

}


const obtenerPaciente = async (req, res) => {

    const { id } = req.params;

    const paciente = await Paciente.findById(id);
    if (!paciente) {
        return res.status(404).json({ msg: "No encontrado" });
    }

    try {

        //para saber si el veterinario esta autenticado
        if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            return res.json({ msg: "Acción denegada" });
        }

        if (paciente) {
            res.json(paciente);
        }



    } catch (error) {
        console.log(error)
    }


}
const actualizarPaciente = async (req, res) => {

    const { id } = req.params;

    const paciente = await Paciente.findById(id);

    if (!paciente) {
        return res.status(404).json({ msg: "No encontrado" });
    }

    try {

        //para saber si el veterinario esta autenticado
        if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            return res.json({ msg: "Acción denegada" });
        }

        //actualizar paciente
        paciente.nombre = req.body.nombre || paciente.nombre;
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email;
        paciente.fecha = req.body.fecha || paciente.fecha;
        paciente.sintomas = req.body.sintomas || paciente.sintomas;


        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);

    } catch (error) {
        console.log(error)
    }
}

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);
    if (!paciente) {
        return res.status(404).json({ msg: "Paciente no encontrado" });
    }
    try {


        await Paciente.deleteOne({ _id: id });
        return res.json({ msg: "Paciente eliminado" });

    } catch (error) {
        console.log(error)
    }
}


export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}