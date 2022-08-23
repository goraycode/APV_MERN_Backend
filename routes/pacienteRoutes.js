import express from "express";
import {
    actualizarPaciente,
    agregarPaciente,
    eliminarPaciente,
    obtenerPaciente,
    obtenerPacientes
} from "../controllers/pacienteController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//en la misma ruta de pacientes enviamos ambas peticiones por post y url(get)
router.route("/")
    .post(checkAuth, agregarPaciente)
    .get(checkAuth, obtenerPacientes);

//Para obtener el paciente y actualizarlo
router.route("/:id")
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)

export default router;
