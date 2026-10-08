const { 
  STATIC_SUGERENCIA_VALIDA, 
  createSugerenciaFixture 
} = require('./fixtures/animeFixtures');

const { 
  crearSugerencia, 
  formatearTitulo, 
  filtrarPorGenero 
} = require('../utils/animeUtilsAssertions');

describe("Pruebas unitarias con Jest Hooks y Fixtures - Episodio Perdido", () => {
  
  // Los valores que voy a usar en las suites.
  let consoleLogSpy;
  let testAnimeList;
  let startTime;

  beforeAll(() => { // AI
    startTime = Date.now();
    process.env.NODE_ENV = 'test';
  });

  afterAll(() => { // AI
    delete process.env.NODE_ENV;
  });

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    testAnimeList = [
      { titulo: "Naruto", genero: "Shonen", anio: 2002 },
      { titulo: "Bleach", genero: "Shonen", anio: 2004 },
      { titulo: "Death Note", genero: "Suspenso", anio: 2006 }
    ];
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

    // -------------------------------------------------------------
  describe("Pruebas usando Static Fixture", () => {
    test("UT-HOOK-001: Crear sugerencia con Static Fixture retorna objeto válido", () => {
      // Arrange
      const input = STATIC_SUGERENCIA_VALIDA;

      // Act
      const resultado = crearSugerencia(input.nombreUsuario, input.tituloAnime, input.descripcion);

      // Assert
      expect(resultado.nombreUsuario).toBe("Jimena");
      expect(resultado.tituloAnime).toBe("Naruto Shippuden");
      expect(resultado.estado).toBe("pendiente");
    });
  });

  // -------------------------------------------------------------
  describe("Pruebas usando Dynamic Fixtures o Factory Pattern", () => {
    test("UT-HOOK-002: Lanza error si falta el título del anime", () => {
      // Arrange
      const sugerenciaInvalida = createSugerenciaFixture({ tituloAnime: "" });

      // Act and Assert
      expect(() => {
        crearSugerencia(
          sugerenciaInvalida.nombreUsuario, 
          sugerenciaInvalida.tituloAnime, 
          sugerenciaInvalida.descripcion
        );
      }).toThrow("Faltan datos de la sugerencia");
    });

    test("UT-HOOK-003: Permite cambiar el estado de la sugerencia dinámicamente", () => {
      // Arrange
      const sugerenciaAprobada = createSugerenciaFixture({ estado: "aprobado" });

      // Act and Assert
      expect(sugerenciaAprobada.estado).toBe("aprobado");
      expect(sugerenciaAprobada.nombreUsuario).toBe("Jimena"); 
    });
  });

  // -------------------------------------------------------------
  describe("Pruebas de filtrado con estado aislado en beforeEach", () => {
    test("UT-HOOK-004: Filtra animes por género usando la lista limpia", () => {
      // Act
      const shonenAnimes = filtrarPorGenero(testAnimeList, "Shonen");

      // Assert
      expect(shonenAnimes).toHaveLength(2);
    });
  });

});

// Important: AI helped me figure out how to place the "beforeAll" and "afterAll" hooks, as I didn't know how to implement them. 
// And I wrote the tests myself, but I needed AI to correct them so I could improve my syntax.