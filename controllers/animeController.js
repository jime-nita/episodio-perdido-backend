const Anime = require('../models/Anime');

// Función para crear un nuevo anime (POST)
exports.crearAnime = async (req, res) => {
    try {
        const nuevoAnime = new Anime(req.body);
        await nuevoAnime.save();
        res.status(201).json({ mensaje: '¡Anime guardado con éxito, beba!', anime: nuevoAnime });
    } catch (error) {
        res.status(400).json({ mensaje: 'Hubo un error al guardar', error });
    }
};

// Función para ver todos los animes (GET)
exports.obtenerAnimes = async (req, res) => {
    try {
        const animes = await Anime.find();
        res.status(200).json(animes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los datos', error });
    }
};

// Obtener un solo anime por ID
exports.obtenerAnimePorId = async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id);
        if (!anime) return res.status(404).json({ mensaje: 'Anime no encontrado' });
        res.status(200).json(anime);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar el anime', error });
    }
};

// Actualizar un anime
exports.actualizarAnime = async (req, res) => {
    try {
        const actualizado = await Anime.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ mensaje: '¡Actualizado con éxito, bonita!', actualizado });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar', error });
    }
};

// Eliminar un anime
exports.eliminarAnime = async (req, res) => {
    try {
        await Anime.findByIdAndDelete(req.params.id);
        res.status(200).json({ mensaje: 'Anime eliminado correctamente de la lista' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar', error });
    }
};