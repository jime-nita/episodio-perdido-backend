const mongoose = require('mongoose');

const sugerenciaSchema = new mongoose.Schema({
    nombreUsuario: { type: String, required: true },
    tituloAnime: { type: String, required: true }, // Cambiamos correo por título
    descripcion: { type: String, required: true },   // Cambiamos mensaje por descripción
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sugerencia', sugerenciaSchema);