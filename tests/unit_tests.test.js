const logger = require("../middlewares/logger");
const Sugerencia = require("../models/Sugerencia");
const animeController = require("../controllers/animeController");
const Anime = require("../models/Anime");
const {
  STATIC_LOGGER_REQUEST,
  createSugerenciaInput,
  createExpressReq,
  createExpressRes
} = require("./fixtures/animeFixtures");

// Mock of the Anime model, I did this because I want the tests to never touch the real database.
jest.mock("../models/Anime", () => ({
  findById: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

describe("Episodio Perdido backend - Unit tests", () => {

  // HOOK for all the tests: cleans the calls of the mocks after each test.
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Primitive values arrange.
  describe("Logger middleware", () => {
    let logSpy;
    let next;

    beforeEach(() => {
      // New spy for each test.
      logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      next = jest.fn();
    });

    afterEach(() => {
      // The spy is always restored, even if the test fails.
      logSpy.mockRestore();
    });

    test("UT-001: Logger prints the request method and route, and calls next", () => {

      // Arrange - my static fixture.
      const { method, url } = STATIC_LOGGER_REQUEST;
      const req = { method: method, url: url };
      const res = {};

      // Act
      logger(req, res, next);

      // Assert
      expect(logSpy).toHaveBeenCalledWith("Petición recibida: GET en la ruta /api/animes");
      expect(next).toHaveBeenCalled();
    });
  });

  // Test 2: Object based arrange.
  test("UT-002: Suggestion without description fails validation", () => {

    // Arrange - my factory: I only remove the description.
    const datos = createSugerenciaInput({ descripcion: undefined });
    const sugerencia = new Sugerencia(datos);

    // Act
    const validationError = sugerencia.validateSync();

    // Assert
    expect(validationError.errors.descripcion).toBeDefined();
    expect(validationError.errors.descripcion.kind).toBe("required");
    expect(sugerencia.nombreUsuario).toBe("Jimena");
  });

  // Test 3: Mock based arrange.
  describe("Anime controller", () => {
    let req;
    let res;

    beforeEach(() => {
      Anime.findById.mockResolvedValue(null);
      req = createExpressReq({ params: { id: "1234" } });
      res = createExpressRes();
    });

    test("UT-003: Searching an anime with a non-existent ID returns 404 and deletes nothing", async () => {
      
      // Act
      await animeController.obtenerAnimePorId(req, res);

      // Assert
      expect(Anime.findById).toHaveBeenCalledWith("1234");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensaje: "Anime no encontrado" });
      expect(Anime.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });

});