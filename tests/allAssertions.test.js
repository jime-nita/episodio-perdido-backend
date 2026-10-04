// ASSERTION TYPE 2 - Behavioral and mock interaction
const { guardarSugerencia, crearSugerencia, filtrarPorGenero } = require("../utils/animeUtilsAssertions");

describe("Episodio Perdido backend - Assertion type 2", () => {

  test("UT-001: Suggestion is sent to the repository one time", () => {

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

  test("UT-002: Repository is called in order when two suggestions are saved", () => {

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

  test("UT-003: Suggestion object contains the expected fields", () => {

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

  test("UT-004: Filtered list contains the expected animes", () => {

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