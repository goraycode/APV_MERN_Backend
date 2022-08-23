import express from "express";
import {
    actualizarPassword,
    actualizarPerfil,
    autenticar,
    comprobarToken,
    confirmar,
    nuevoPassword,
    olvidePassword,
    perfil,
    registrar
} from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//Area publica
router.post('/', registrar);

/*Para realizar una variable dinámica y pasarla por la URL se 
realiza de la siguiente manera, en la que ese valor se le asignara a la palabra 
que esta despues de los dos puntos y podremos leerlo con req.params*/

router.get('/confirmar/:token', confirmar);

router.post('/login', autenticar);

/* Para validar el email del password y enviarle un token*/
router.post('/olvide-password', olvidePassword);

/* para verificar que el token es correcto y luego
para cambiar el valor del token */
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);


//Area privada
//protegemos esta ruta para que no cualquiera pueda acceder
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);



export default router;
