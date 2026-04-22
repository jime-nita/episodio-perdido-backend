const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    genero: { type: String, required: true },
    anio: { type: Number },
    descripcion: { type: String },
    imagenUrl: { type: String } 
});

module.exports = mongoose.model('Anime', animeSchema);