const mongoose = require('mongoose');

const sugerenciaSchema = new mongoose.Schema({
    nombreUsuario: { type: String, required: true },
    correo: { type: String, required: true },
    mensaje: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sugerencia', sugerenciaSchema);