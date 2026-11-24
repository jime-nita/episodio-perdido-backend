// Regression suite: 18 tests (8 positive, 5 negative, 5 edge).
const logger = require("../../middlewares/logger");
const Sugerencia = require("../../models/Sugerencia");
const animeController = require("../../controllers/animeController");
const Anime = require("../../models/Anime");
const {
  formatearTitulo,
  crearSugerencia,
  guardarSugerencia,
  filtrarPorGenero,
  obtenerAnimeAsync,
  buscarAnimePorTitulo
} = require("../../utils/animeUtilsAssertions");

const {
  STATIC_SUGERENCIA_INPUT,
  STATIC_TITULO_SUCIO,
  STATIC_LOGGER_REQUEST,
  createSugerenciaInput,
  createAnimeList,
  createShortAnimeList,
  createRepositorioFalso,
  createExpressReq,
  createExpressRes
} = require("../fixtures/animeFixtures");

// The Anime model is mocked so these tests never touch the database.
jest.mock("../../models/Anime", () => ({
  findById: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

describe("Unit - Regression suite", () => {
  let catalogoReferencia;
  let animesCortos;
  let repositorioFalso;

  beforeAll(() => {
    catalogoReferencia = Object.freeze(createAnimeList());
  });

  beforeEach(() => {
    animesCortos = createShortAnimeList();
    repositorioFalso = createRepositorioFalso();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    catalogoReferencia = null;
  });

  // ---------- POSITIVE ----------

  test("UT-RG-01: Repository is called in order when two suggestions are saved", () => {
    // Arrange
    const primera = createSugerenciaInput({ tituloAnime: "Death Note" });
    const segunda = createSugerenciaInput({ nombreUsuario: "Carlos", tituloAnime: "Bleach" });
    // Act
    guardarSugerencia(primera, repositorioFalso);
    guardarSugerencia(segunda, repositorioFalso);
    // Assert
    expect(repositorioFalso.guardar).toHaveBeenCalledTimes(2);
    expect(repositorioFalso.guardar).toHaveBeenNthCalledWith(1, primera);
    expect(repositorioFalso.guardar).toHaveBeenNthCalledWith(2, segunda);
  });

  test("UT-RG-02: Suggestion object contains the expected fields", () => {
    // Arrange
    const { nombreUsuario, tituloAnime, descripcion } = STATIC_SUGERENCIA_INPUT;
    // Act
    const resultado = crearSugerencia(nombreUsuario, tituloAnime, descripcion);
    // Assert
    expect(resultado).toEqual(
      expect.objectContaining({
        tituloAnime: "Naruto Shippuden",
        estado: "pendiente",
        nombreUsuario: expect.any(String),
        descripcion: expect.stringContaining("anime")
      })
    );
  });

  test("UT-RG-03: Filtered list contains the expected animes", () => {
    // Arrange
    const animes = catalogoReferencia;
    // Act
    const resultado = filtrarPorGenero(animes, "Shonen");
    // Assert
    expect(resultado).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ titulo: "Naruto" }),
        expect.objectContaining({ titulo: "Bleach" })
      ])
    );
    expect(resultado).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ titulo: "Death Note" })])
    );
  });

  test("UT-RG-04: Searching an existing anime resolves the Promise", async () => {
    // Arrange
    const animes = animesCortos;
    // Act
    const resultado = obtenerAnimeAsync(animes, "Death Note");
    // Assert
    await expect(resultado).resolves.toEqual({ titulo: "Death Note", genero: "Suspenso", anio: 2006 });
  });

  test("UT-RG-05: Searching an existing anime returns a value", () => {
    // Arrange
    const animes = animesCortos;
    // Act
    const resultado = buscarAnimePorTitulo(animes, "Death Note");
    // Assert
    expect(resultado).toBeDefined();
    expect(resultado).toBeTruthy();
    expect(resultado).not.toBeNull();
  });

  test("UT-RG-06: Filtering by genre returns a list with the right animes", () => {
    // Arrange
    const animes = catalogoReferencia;
    // Act
    const resultado = filtrarPorGenero(animes, "Shonen");
    const titulos = resultado.map((anime) => anime.titulo);
    // Assert
    expect(resultado).toHaveLength(2);
    expect(resultado).toContainEqual({ titulo: "Naruto", genero: "Shonen", anio: 2002 });
    expect(titulos).toContain("Bleach");
    expect(titulos).not.toContain("Death Note");
  });

  test("UT-RG-07: Formatted title has the expected text, length and pattern", () => {
    // Arrange
    const titulo = STATIC_TITULO_SUCIO;
    // Act
    const resultado = formatearTitulo(titulo);
    // Assert
    expect(resultado).toHaveLength(13);
    expect(resultado).toContain("Ball");
    expect(resultado).toMatch(/^Dragon/);
    expect(resultado).not.toMatch(/\s$/);
  });

  test("UT-RG-08: Logger prints the request method and route, and calls next", () => {
    // Arrange
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const next = jest.fn();
    const { method, url } = STATIC_LOGGER_REQUEST;
    // Act
    logger({ method, url }, {}, next);
    // Assert
    expect(logSpy).toHaveBeenCalledWith("Petición recibida: GET en la ruta /api/animes");
    expect(next).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  // ---------- NEGATIVE ----------

  test("UT-RG-09: Saving without a suggestion throws an error and does not call the repository", () => {
    // Arrange
    const sugerencia = null;
    // Act
    const guardar = () => guardarSugerencia(sugerencia, repositorioFalso);
    // Assert
    expect(guardar).toThrow("Falta la sugerencia");
    expect(repositorioFalso.guardar).not.toHaveBeenCalled();
  });

  test("UT-RG-10: Searching a non-existent anime rejects the Promise", async () => {
    // Arrange
    const animes = animesCortos;
    // Act
    const resultado = obtenerAnimeAsync(animes, "One Piece");
    // Assert
    await expect(resultado).rejects.toThrow("Anime no encontrado");
  });

  test("UT-RG-11: Searching a non-existent anime returns null", () => {
    // Arrange
    const animes = animesCortos;
    // Act
    const resultado = buscarAnimePorTitulo(animes, "One Piece");
    // Assert
    expect(resultado).toBeNull();
    expect(resultado).toBeFalsy();
  });

  test("UT-RG-12: Suggestion without description fails validation", () => {
    // Arrange
    const datos = createSugerenciaInput({ descripcion: undefined });
    const sugerencia = new Sugerencia(datos);
    // Act
    const validationError = sugerencia.validateSync();
    // Assert
    expect(validationError.errors.descripcion).toBeDefined();
    expect(validationError.errors.descripcion.kind).toBe("required");
  });

  test("UT-RG-13: Searching an anime with a non-existent ID returns 404", async () => {
    // Arrange
    Anime.findById.mockResolvedValue(null);
    const req = createExpressReq({ params: { id: "1234" } });
    const res = createExpressRes();
    // Act
    await animeController.obtenerAnimePorId(req, res);
    // Assert
    expect(Anime.findById).toHaveBeenCalledWith("1234");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Anime no encontrado" });
  });

  // ---------- EDGE ----------

  test("UT-RG-14: A title with only spaces becomes an empty string", () => {
    // Arrange
    const titulo = "   ";
    // Act
    const resultado = formatearTitulo(titulo);
    // Assert
    expect(resultado).toBe("");
  });

  test("UT-RG-15: A title with one letter is capitalized", () => {
    // Arrange
    const titulo = "z";
    // Act
    const resultado = formatearTitulo(titulo);
    // Assert
    expect(resultado).toBe("Z");
  });

  test("UT-RG-16: Filtering an empty list returns an empty list", () => {
    // Arrange
    const animes = [];
    // Act
    const resultado = filtrarPorGenero(animes, "Shonen");
    // Assert
    expect(resultado).toEqual([]);
  });

  test("UT-RG-17: Filtering with exactly one match returns one anime", () => {
    // Arrange
    const animes = animesCortos;
    // Act
    const resultado = filtrarPorGenero(animes, "Shonen");
    // Assert
    expect(resultado).toHaveLength(1);
    expect(resultado[0].titulo).toBe("Naruto");
  });

  test("UT-RG-18: A suggestion with a title of only spaces should throw an error", () => {
    // Arrange
    const { nombreUsuario, descripcion } = createSugerenciaInput();
    const tituloVacio = "   ";
    // Act
    const crear = () => crearSugerencia(nombreUsuario, tituloVacio, descripcion);
    // Assert
    expect(crear).toThrow("Faltan datos de la sugerencia");
  });
});