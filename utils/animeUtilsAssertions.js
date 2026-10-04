// My system under test: Episodio Perdido backend.
// These are the new helper functions for my proyect. 

// Assertion types: 
// 1 - Structural equivalence and value equality.
// 6 - Collections and strings.
function formatearTitulo(titulo) {
  return titulo
    .trim()
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(" ");
}

// Assertion types: 
// 1 - Structural equivalence and value equality.
// 3 - Asymmetric and partial matchers.
// 4 - Exceptions and async handling.
function crearSugerencia(nombreUsuario, tituloAnime, descripcion) {
  if (!nombreUsuario || !tituloAnime || !descripcion) {
    throw new Error("Faltan datos de la sugerencia");
  }

  return {
    nombreUsuario: nombreUsuario,
    tituloAnime: formatearTitulo(tituloAnime),
    descripcion: descripcion,
    estado: "pendiente"
  };
}

// Assertion types: 
// 2 - Behavioral and mock interaction.
// 4 - Exceptions and async handling.
function guardarSugerencia(sugerencia, repositorio) {
  if (!sugerencia) {
    throw new Error("Falta la sugerencia");
  }

  repositorio.guardar(sugerencia);
  return true;
}

// Assertion type: 
// 6 - Collections and strings.
function filtrarPorGenero(animes, genero) {
  return animes.filter((anime) => anime.genero === genero);
}

// Assertion type: 
// 4 - Exceptions and async handling.
async function obtenerAnimeAsync(animes, titulo) {
  const anime = buscarAnimePorTitulo(animes, titulo);

  if (!anime) {
    throw new Error("Anime no encontrado");
  }

  return anime;
}

// Assertion type: 
// 5 - Existence and truthiness.
function buscarAnimePorTitulo(animes, titulo) {
  const encontrado = animes.find((anime) => anime.titulo === titulo);
  return encontrado || null;
}

module.exports = {
  formatearTitulo,
  crearSugerencia,
  guardarSugerencia,
  filtrarPorGenero,
  obtenerAnimeAsync,
  buscarAnimePorTitulo
};