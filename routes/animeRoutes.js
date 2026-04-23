const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

router.post('/', animeController.crearAnime); // crear
router.get('/', animeController.obtenerAnimes); // leer todos
router.get('/:id', animeController.obtenerAnimePorId); // leer uno
router.put('/:id', animeController.actualizarAnime); // actualizar
router.delete('/:id', animeController.eliminarAnime); // borrar

module.exports = router;