const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

router.post('/', animeController.crearAnime); // Crear
router.get('/', animeController.obtenerAnimes); // Leer todos
router.get('/:id', animeController.obtenerAnimePorId); // Leer uno
router.put('/:id', animeController.actualizarAnime); // Actualizar
router.delete('/:id', animeController.eliminarAnime); // Borrar

module.exports = router;