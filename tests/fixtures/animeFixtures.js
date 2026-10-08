const STATIC_TITULO_SUCIO = "  dRAGON ball z ";

const STATIC_SUGERENCIA_INPUT = Object.freeze({
  nombreUsuario: "Jimena",
  tituloAnime: "naruto shippuden",
  descripcion: "Me gustaria ver este anime en la pagina"
});

const STATIC_SUGERENCIA_ESPERADA = Object.freeze({
  nombreUsuario: "Jimena",
  tituloAnime: "Naruto Shippuden",
  descripcion: "Me gustaria ver este anime en la pagina",
  estado: "pendiente"
});

const createSugerenciaInput = (overrides = {}) => ({
  nombreUsuario: "Jimena",
  tituloAnime: "naruto shippuden",
  descripcion: "Me gustaria ver este anime en la pagina",
  ...overrides
});

const createAnime = (overrides = {}) => ({
  titulo: "Naruto",
  genero: "Shonen",
  anio: 2002,
  ...overrides
});

const createAnimeList = () => [
  createAnime({ titulo: "Naruto", genero: "Shonen", anio: 2002 }),
  createAnime({ titulo: "Bleach", genero: "Shonen", anio: 2004 }),
  createAnime({ titulo: "Death Note", genero: "Suspenso", anio: 2006 })
];

const createShortAnimeList = () => [
  createAnime({ titulo: "Naruto", genero: "Shonen", anio: 2002 }),
  createAnime({ titulo: "Death Note", genero: "Suspenso", anio: 2006 })
];

const createRepositorioFalso = () => ({ guardar: jest.fn() });

const STATIC_LOGGER_REQUEST = Object.freeze({
  method: "GET",
  url: "/api/animes"
});

const createExpressReq = (overrides = {}) => ({
  params: { id: "1234" },
  ...overrides
});

const createExpressRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
});

module.exports = {
  STATIC_TITULO_SUCIO,
  STATIC_SUGERENCIA_INPUT,
  STATIC_SUGERENCIA_ESPERADA,
  createSugerenciaInput,
  createAnime,
  createAnimeList,
  createShortAnimeList,
  createRepositorioFalso,
  STATIC_LOGGER_REQUEST,
  createExpressReq,
  createExpressRes
};