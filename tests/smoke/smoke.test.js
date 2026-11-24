// Smoke suite: the 5 most important checks. If these fail, we stop.
const {
  formatearTitulo,
  crearSugerencia,
  guardarSugerencia,
  filtrarPorGenero
} = require("../../utils/animeUtilsAssertions");

const {
  STATIC_TITULO_SUCIO,
  STATIC_SUGERENCIA_INPUT,
  STATIC_SUGERENCIA_ESPERADA,
  createSugerenciaInput,
  createShortAnimeList,
  createRepositorioFalso
} = require("../fixtures/animeFixtures");

describe("Unit - Smoke suite", () => {
  let animesCortos;
  let repositorioFalso;

  beforeEach(() => {
    animesCortos = createShortAnimeList();
    repositorioFalso = createRepositorioFalso();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("UT-SM-01: Title is formatted with a capital letter in each word", () => {
    // Arrange
    const titulo = STATIC_TITULO_SUCIO;
    // Act
    const resultado = formatearTitulo(titulo);
    // Assert
    expect(resultado).toBe("Dragon Ball Z");
  });

  test("UT-SM-02: Valid suggestion is created with the expected structure", () => {
    // Arrange
    const { nombreUsuario, tituloAnime, descripcion } = STATIC_SUGERENCIA_INPUT;
    // Act
    const resultado = crearSugerencia(nombreUsuario, tituloAnime, descripcion);
    // Assert
    expect(resultado).toEqual(STATIC_SUGERENCIA_ESPERADA);
  });

  test("UT-SM-03: Suggestion is sent to the repository one time", () => {
    // Arrange
    const sugerencia = STATIC_SUGERENCIA_ESPERADA;
    // Act
    const resultado = guardarSugerencia(sugerencia, repositorioFalso);
    // Assert
    expect(repositorioFalso.guardar).toHaveBeenCalledTimes(1);
    expect(repositorioFalso.guardar).toHaveBeenCalledWith(sugerencia);
    expect(resultado).toBe(true);
  });

  test("UT-SM-04: Creating a suggestion with missing data throws an error", () => {
    // Arrange
    const { nombreUsuario, tituloAnime, descripcion } = createSugerenciaInput({ tituloAnime: "" });
    // Act
    const crear = () => crearSugerencia(nombreUsuario, tituloAnime, descripcion);
    // Assert
    expect(crear).toThrow("Faltan datos de la sugerencia");
  });

  test("UT-SM-05: Filtering by a genre without animes returns an empty list", () => {
    // Arrange
    const animes = animesCortos;
    // Act
    const resultado = filtrarPorGenero(animes, "Mecha");
    // Assert
    expect(resultado).toHaveLength(0);
  });
});