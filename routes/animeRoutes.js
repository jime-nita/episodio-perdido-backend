const express = require('express');
const router = express.Router();
const Anime = require('../models/Anime'); // Asegúrate de que la ruta a tu modelo sea correcta

// 1. OBTENER TODOS LOS ANIMES (READ)
router.get('/', async (req, res) => {
    try {
        const animes = await Anime.find();
        res.status(200).json(animes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los animes", error: error.message });
    }
});

// 2. OBTENER UN ANIME POR SU ID (READ SPECIFIC)
router.get('/:id', async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id);
        if (!anime) return res.status(404).json({ mensaje: "Anime no encontrado" });
        res.status(200).json(anime);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar el anime", error: error.message });
    }
});

// 3. CREAR UN NUEVO ANIME (CREATE)
router.post('/', async (req, res) => {
    const nuevoAnime = new Anime(req.body);
    try {
        const animeGuardado = await nuevoAnime.save();
        res.status(201).json(animeGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al guardar el anime", error: error.message });
    }
});

// 4. ACTUALIZAR UN ANIME (UPDATE) - ¡Nuevo para el Ordinario!
router.put('/:id', async (req, res) => {
    try {
        const animeActualizado = await Anime.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Esto devuelve el objeto ya actualizado
        );
        if (!animeActualizado) return res.status(404).json({ mensaje: "No se pudo actualizar, no se encontró el ID" });
        res.status(200).json(animeActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar", error: error.message });
    }
});

// 5. ELIMINAR UN ANIME (DELETE) - ¡Nuevo para el Ordinario!
router.delete('/:id', async (req, res) => {
    try {
        const animeEliminado = await Anime.findByIdAndDelete(req.params.id);
        if (!animeEliminado) return res.status(404).json({ mensaje: "No se encontró el anime para eliminar" });
        res.status(200).json({ mensaje: "Anime eliminado correctamente de la base de datos" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar", error: error.message });
    }
});

module.exports = router;