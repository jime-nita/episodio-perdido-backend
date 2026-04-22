const Sugerencia = require('../models/Sugerencia');

exports.crearSugerencia = async (req, res) => {
    try {
        const nuevaSugerencia = new Sugerencia(req.body);
        await nuevaSugerencia.save();
        res.status(201).json({ mensaje: 'Sugerencia recibida, ¡gracias bonita!', nuevaSugerencia });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al enviar sugerencia', error });
    }
};

exports.obtenerSugerencias = async (req, res) => {
    try {
        const sugerencias = await Sugerencia.find();
        res.status(200).json(sugerencias);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener sugerencias', error });
    }
};