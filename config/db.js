const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('¡Conexión exitosa a MongoDB, beba! ✨');
    } catch (error) {
        console.error('Error al conectar la base de datos:', error);
        process.exit(1); // detiene la app si falla la conexión
    }
};

module.exports = conectarDB;