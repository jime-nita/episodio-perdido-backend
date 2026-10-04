const { formatearTitulo, crearSugerencia, guardarSugerencia, filtrarPorGenero, obtenerAnimeAsync, buscarAnimePorTitulo } = require("../utils/animeUtilsAssertions");

// ASSERTION TYPE 1 - Structural equivalence and value equality.
describe("Episodio Perdido backend - Assertion type 1", () => {

  test("UT-001: Title is formatted with a capital letter in each word", () => {

    // Arrange
    const titulo = "  dRAGON ball z ";

    // Act
    const resultado = formatearTitulo(titulo);

    // Assert
    expect(resultado).toBe("Dragon Ball Z");
    expect(resultado).not.toBe("dRAGON ball z");
  });

  test("UT-002: Valid suggestion is created with the expected structure", () => {

    // Arrange
    const nombreUsuario = "Jimena";
    const tituloAnime = "naruto shippuden";
    const descripcion = "Me gustaria ver este anime en la pagina";

    // Act
    const resultado = crearSugerencia(nombreUsuario, tituloAnime, descripcion);

    // Assert
    expect(resultado).toEqual({
      nombreUsuario: "Jimena",
      tituloAnime: "Naruto Shippuden",
      descripcion: "Me gustaria ver este anime en la pagina",
      estado: "pendiente"
    });
    expect(resultado).toStrictEqual({
      nombreUsuario: "Jimena",
      tituloAnime: "Naruto Shippuden",
      descripcion: "Me gustaria ver este anime en la pagina",
      estado: "pendiente"
    });
  });

});

// ASSERTION TYPE 2 - Behavioral and mock interaction
describe("Episodio Perdido backend - Assertion type 2", () => {

  test("UT-003: Suggestion is sent to the repository one time", () => {

    // Arrange
    const sugerencia = {
      nombreUsuario: "Jimena",
      tituloAnime: "Naruto Shippuden",
      descripcion: "Me gustaria ver este anime en la pagina",
      estado: "pendiente"
    };
    const repositorioFalso = { guardar: jest.fn() };

    // Act
    const resultado = guardarSugerencia(sugerencia, repositorioFalso);

    // Assert
    expect(repositorioFalso.guardar).toHaveBeenCalled();
    expect(repositorioFalso.guardar).toHaveBeenCalledTimes(1);
    expect(repositorioFalso.guardar).toHaveBeenCalledWith(sugerencia);
    expect(resultado).toBe(true);
  });

  test("UT-004: Repository is called in order when two suggestions are saved", () => {

    // Arrange
    const primera = { nombreUsuario: "Jimena", tituloAnime: "Death Note" };
    const segunda = { nombreUsuario: "Carlos", tituloAnime: "Bleach" };
    const repositorioFalso = { guardar: jest.fn() };

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

    // Arrange
    const nombreUsuario = "Jimena";
    const tituloAnime = "naruto shippuden";
    const descripcion = "Me gustaria ver este anime en la pagina";

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

    // Arrange
    const animes = [
      { titulo: "Naruto", genero: "Shonen", anio: 2002 },
      { titulo: "Bleach", genero: "Shonen", anio: 2004 },
      { titulo: "Death Note", genero: "Suspenso", anio: 2006 }
    ];

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

    // Arrange
    const nombreUsuario = "Jimena";
    const tituloAnime = "";
    const descripcion = "Me gustaria ver este anime en la pagina";

    // Act
    const crear = () => crearSugerencia(nombreUsuario, tituloAnime, descripcion);

    // Assert
    expect(crear).toThrow();
    expect(crear).toThrow(Error);
    expect(crear).toThrow("Faltan datos de la sugerencia");
  });

  test("UT-008: Saving without a suggestion throws an error and does not call the repository", () => {

    // Arrange
    const repositorioFalso = { guardar: jest.fn() };

    // Act
    const guardar = () => guardarSugerencia(null, repositorioFalso);

    // Assert
    expect(guardar).toThrow("Falta la sugerencia");
    expect(repositorioFalso.guardar).not.toHaveBeenCalled();
  });

  test("UT-009: Searching an existing anime resolves the Promise", async () => {

    // Arrange
    const animes = [
      { titulo: "Naruto", genero: "Shonen", anio: 2002 },
      { titulo: "Death Note", genero: "Suspenso", anio: 2006 }
    ];

    // Act
    const resultado = obtenerAnimeAsync(animes, "Death Note");

    // Assert
    await expect(resultado).resolves.toEqual({ titulo: "Death Note", genero: "Suspenso", anio: 2006 });
  });

  test("UT-010: Searching a non-existent anime rejects the Promise", async () => {

    // Arrange
    const animes = [
      { titulo: "Naruto", genero: "Shonen", anio: 2002 },
      { titulo: "Death Note", genero: "Suspenso", anio: 2006 }
    ];

    // Act
    const resultado = obtenerAnimeAsync(animes, "One Piece");

    // Assert
    await expect(resultado).rejects.toThrow("Anime no encontrado");
  });

});

// ASSERTION TYPE 5 - Existence and truthiness.
describe("Episodio Perdido backend - Assertion type 5", () => {

  test("UT-011: Searching an existing anime returns a value", () => {

    // Arrange
    const animes = [
      { titulo: "Naruto", genero: "Shonen", anio: 2002 },
      { titulo: "Death Note", genero: "Suspenso", anio: 2006 }
    ];

    // Act
    const resultado = buscarAnimePorTitulo(animes, "Death Note");

    // Assert
    expect(resultado).toBeDefined();
    expect(resultado).toBeTruthy();
    expect(resultado).not.toBeNull();
  });

  test("UT-012: Searching a non-existent anime returns null", () => {

    // Arrange
    const animes = [
      { titulo: "Naruto", genero: "Shonen", anio: 2002 },
      { titulo: "Death Note", genero: "Suspenso", anio: 2006 }
    ];

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

    // Arrange
    const animes = [
      { titulo: "Naruto", genero: "Shonen", anio: 2002 },
      { titulo: "Bleach", genero: "Shonen", anio: 2004 },
      { titulo: "Death Note", genero: "Suspenso", anio: 2006 }
    ];

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

    // Arrange
    const animes = [
      { titulo: "Naruto", genero: "Shonen", anio: 2002 },
      { titulo: "Death Note", genero: "Suspenso", anio: 2006 }
    ];

    // Act
    const resultado = filtrarPorGenero(animes, "Mecha");

    // Assert
    expect(resultado).toHaveLength(0);
    expect(resultado).not.toContainEqual(animes[0]);
  });

  test("UT-015: Formatted title has the expected text, length and pattern", () => {

    // Arrange
    const titulo = "  dRAGON ball z ";

    // Act
    const resultado = formatearTitulo(titulo);

    // Assert
    expect(resultado).toHaveLength(13);
    expect(resultado).toContain("Ball");
    expect(resultado).toMatch(/^Dragon/);
    expect(resultado).not.toMatch(/\s$/);
  });

});