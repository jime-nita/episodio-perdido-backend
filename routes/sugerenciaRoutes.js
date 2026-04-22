const express = require('express');
const router = express.Router();
const sugerenciaController = require('../controllers/sugerenciaController');

router.post('/', sugerenciaController.crearSugerencia);
router.get('/', sugerenciaController.obtenerSugerencias);

module.exports = router;