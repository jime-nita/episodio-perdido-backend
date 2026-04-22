const express = require('express');
const conectarDB = require('./config/db'); // Importamos la config
const logger = require('./middlewares/logger'); // Importamos el middleware
require('dotenv').config();

const app = express();

// Conectar a la base de datos
conectarDB();

// MIDDLEWARES
app.use(express.json());
app.use(logger); // Aquí activamos tu middleware de registro

// RUTAS
app.use('/api/animes', require('./routes/animeRoutes'));
app.use('/api/sugerencias', require('./routes/sugerenciaRoutes'));

app.get('/', (req, res) => {
    res.send('Servidor de Episodio Perdido funcionando 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});