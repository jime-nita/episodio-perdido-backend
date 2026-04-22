const logger = (req, res, next) => {
    console.log(`Petición recibida: ${req.method} en la ruta ${req.url}`);
    next(); // Esto permite que la petición siga su camino
};

module.exports = logger;