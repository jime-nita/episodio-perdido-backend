const express = require('express');
const conectarDB = require('./config/db'); 
const logger = require('./middlewares/logger'); 
require('dotenv').config();

const app = express();

conectarDB();

app.use(express.json());
app.use(logger); 

// rutas
app.use('/api/animes', require('./routes/animeRoutes'));
app.use('/api/sugerencias', require('./routes/sugerenciaRoutes'));

app.get('/', (req, res) => {
    res.send('Servidor de Episodio Perdido funcionando correctamente, beba 🌟');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});