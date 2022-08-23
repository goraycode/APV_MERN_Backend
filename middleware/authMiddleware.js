import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {

        try {

            /* Obtenemos el token */
            const token = authorization.split(" ")[1];

            //decodificamos lo valores que tienen el token el valor del token y el decodificador
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //traermos al veterinario con ese id y evitamos traer otros datos
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");

            return next();

        } catch (error) {
            const e = new Error('Token no válido');
            return res.status(403).json({ msg: e.message });
        }

    }

    if (token) {

        const error = new Error('Token no válido o inexistente');
        res.status(403).json({ msg: error.message });
    }

    next(); //para que vaya al siguiente middleware que es perfil
}

export default checkAuth;