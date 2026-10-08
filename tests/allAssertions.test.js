const { formatearTitulo, crearSugerencia, guardarSugerencia, filtrarPorGenero, obtenerAnimeAsync, buscarAnimePorTitulo } = require("../utils/animeUtilsAssertions");

const {
  STATIC_TITULO_SUCIO,
  STATIC_SUGERENCIA_INPUT,
  STATIC_SUGERENCIA_ESPERADA,
  createSugerenciaInput,
  createAnimeList,
  createShortAnimeList,
  createRepositorioFalso
} = require("./fixtures/animeFixtures");

let catalogoReferencia; 
let animesCortos;       
let repositorioFalso;   

// HOOKS
beforeAll(() => {
  // Created one time: the tests only read this list, they never change it.
  catalogoReferencia = Object.freeze(createAnimeList());
});

beforeEach(() => {
  // Created before each test: every test starts with clean data.
  animesCortos = createShortAnimeList();
  repositorioFalso = createRepositorioFalso();
});

afterEach(() => {
  // Cleans the calls of the mocks, so one test does not affect the next one.
  jest.clearAllMocks();
});

afterAll(() => {
  catalogoReferencia = null;
});

// ASSERTION TYPE 1 - Structural equivalence and value equality.
describe("Episodio Perdido backend - Assertion type 1", () => {

  test("UT-001: Title is formatted with a capital letter in each word", () => {

    // Arrange- my static fixture.
    const titulo = STATIC_TITULO_SUCIO;

    // Act
    const resultado = formatearTitulo(titulo);

    // Assert
    expect(resultado).toBe("Dragon Ball Z");
    expect(resultado).not.toBe("dRAGON ball z");
  });

  test("UT-002: Valid suggestion is created with the expected structure", () => {

    // Arrange- my static fixtures: input and expected result.
    const { nombreUsuario, tituloAnime, descripcion } = STATIC_SUGERENCIA_INPUT;

    // Act
    const resultado = crearSugerencia(nombreUsuario, tituloAnime, descripcion);

    // Assert
    expect(resultado).toEqual(STATIC_SUGERENCIA_ESPERADA);
    expect(resultado).toStrictEqual(STATIC_SUGERENCIA_ESPERADA);
  });

});

// ASSERTION TYPE 2 - Behavioral and mock interaction
describe("Episodio Perdido backend - Assertion type 2", () => {

  test("UT-003: Suggestion is sent to the repository one time", () => {

    // Arrange - the static fixture plus fake repository from beforeEach.
    const sugerencia = STATIC_SUGERENCIA_ESPERADA;

    // Act
    const resultado = guardarSugerencia(sugerencia, repositorioFalso);

    // Assert
    expect(repositorioFalso.guardar).toHaveBeenCalled();
    expect(repositorioFalso.guardar).toHaveBeenCalledTimes(1);
    expect(repositorioFalso.guardar).toHaveBeenCalledWith(sugerencia);
    expect(resultado).toBe(true);
  });

  test("UT-004: Repository is called in order when two suggestions are saved", () => {

    // Arrange - my factory: I change only the fields I need.
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

});

// ASSERTION TYPE 3 - Asymmetric and partial matchers
describe("Episodio Perdido backend - Assertion type 3", () => {

  test("UT-005: Suggestion object contains the expected fields", () => {

    // Arrange - my static fixture
    const { nombreUsuario, tituloAnime, descripcion } = STATIC_SUGERENCIA_INPUT;

    // Act
    const resultado = crearSugerencia(nombreUsuario, tituloAnime, descripcion);

    // Assert
    expect(resultado).toEqual(
      expect.objectContaining({
        tituloAnime: "Naruto Shippuden",
        estado: "pendiente"
      })
    );
    expect(resultado).toEqual(
      expect.objectContaining({
        nombreUsuario: expect.any(String),
        descripcion: expect.stringContaining("anime")
      })
    );
  });

  test("UT-006: Filtered list contains the expected animes", () => {

    // Arrange - the read-only list created one time in beforeAll.
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
      expect.arrayContaining([
        expect.objectContaining({ titulo: "Death Note" })
      ])
    );
  });

});

// ASSERTION TYPE 4 - Exceptions and async handling.
describe("Episodio Perdido backend - Assertion type 4", () => {

  test("UT-007: Creating a suggestion with missing data throws an error", () => {

    // Arrange - my factory: I change only the title to make the data invalid.
    const { nombreUsuario, tituloAnime, descripcion } = createSugerenciaInput({ tituloAnime: "" });

    // Act
    const crear = () => crearSugerencia(nombreUsuario, tituloAnime, descripcion);

    // Assert
    expect(crear).toThrow();
    expect(crear).toThrow(Error);
    expect(crear).toThrow("Faltan datos de la sugerencia");
  });

  test("UT-008: Saving without a suggestion throws an error and does not call the repository", () => {

    // Arrange - my fake repository from beforeEach.
    const sugerencia = null;

    // Act
    const guardar = () => guardarSugerencia(sugerencia, repositorioFalso);

    // Assert
    expect(guardar).toThrow("Falta la sugerencia");
    expect(repositorioFalso.guardar).not.toHaveBeenCalled();
  });

  test("UT-009: Searching an existing anime resolves the Promise", async () => {

    // Arrange - my short list from beforeEach.
    const animes = animesCortos;

    // Act
    const resultado = obtenerAnimeAsync(animes, "Death Note");

    // Assert
    await expect(resultado).resolves.toEqual({ titulo: "Death Note", genero: "Suspenso", anio: 2006 });
  });

  test("UT-010: Searching a non-existent anime rejects the Promise", async () => {

    // Arrange - my short list from beforeEach.
    const animes = animesCortos;

    // Act
    const resultado = obtenerAnimeAsync(animes, "One Piece");

    // Assert
    await expect(resultado).rejects.toThrow("Anime no encontrado");
  });

});

// ASSERTION TYPE 5 - Existence and truthiness.
describe("Episodio Perdido backend - Assertion type 5", () => {

  test("UT-011: Searching an existing anime returns a value", () => {

    // Arrange - my short list from beforeEach.
    const animes = animesCortos;

    // Act
    const resultado = buscarAnimePorTitulo(animes, "Death Note");

    // Assert
    expect(resultado).toBeDefined();
    expect(resultado).toBeTruthy();
    expect(resultado).not.toBeNull();
  });

  test("UT-012: Searching a non-existent anime returns null", () => {

    // Arrange - my short list from beforeEach.
    const animes = animesCortos;

    // Act
    const resultado = buscarAnimePorTitulo(animes, "One Piece");

    // Assert
    expect(resultado).toBeNull();
    expect(resultado).toBeFalsy();
  });

});

// ASSERTION TYPE 6 - Collections and strings.
describe("Episodio Perdido backend - Assertion type 6", () => {

  test("UT-013: Filtering by genre returns a list with the right animes", () => {

    // Arrange - the read-only list created one time in beforeAll.
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

  test("UT-014: Filtering by a genre without animes returns an empty list", () => {

    // Arrange - my short list from beforeEach.
    const animes = animesCortos;

    // Act
    const resultado = filtrarPorGenero(animes, "Mecha");

    // Assert
    expect(resultado).toHaveLength(0);
    expect(resultado).not.toContainEqual(animes[0]);
  });

  test("UT-015: Formatted title has the expected text, length and pattern", () => {

    // Arrange - my static fixture
    const titulo = STATIC_TITULO_SUCIO;

    // Act
    const resultado = formatearTitulo(titulo);

    // Assert
    expect(resultado).toHaveLength(13);
    expect(resultado).toContain("Ball");
    expect(resultado).toMatch(/^Dragon/);
    expect(resultado).not.toMatch(/\s$/);
  });

});