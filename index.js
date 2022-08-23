import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';

const app = express();
//Obtener body parser para leer los datos del formulario
app.use(express.json());



//para traernos las variables de entorno
dotenv.config();
conectarDB(process.env.MONGO_URI);

const dominiosPermitidos = [`${process.env.FRONTEND_URL}`];
const corsOptions = {
    origin: function (origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            //el origen del requesta esta permitido
            callback(null, true);
        } else {
            callback(new Error('No permitido por cors'));
        }
    }
}

app.use(cors(corsOptions));

//para hacer el router del veterinario
app.use('/api/veterinarios', veterinarioRoutes);

//routes del veterinario
app.use('/api/pacientes', pacienteRoutes);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
})