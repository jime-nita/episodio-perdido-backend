const logger = require("../middlewares/logger");
const Sugerencia = require("../models/Sugerencia");
const animeController = require("../controllers/animeController");
const Anime = require("../models/Anime");

// Mock of the Anime model, i did this because i wantthe tests never touch the real database.
jest.mock("../models/Anime", () => ({
  findById: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

describe("Episodio Perdido backend - Unit tests", () => {

  // Test 1: Primitive values arrange.
  test("UT-001: Logger prints the request method and route, and calls next", () => {

    // Arrange
    const method = "GET";
    const url = "/api/animes";
    const req = { method: method, url: url };
    const res = {};
    let nextWasCalled = false;
    const next = () => { nextWasCalled = true; };
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Act
    logger(req, res, next);

    // Assert
    expect(logSpy).toHaveBeenCalledWith("Petición recibida: GET en la ruta /api/animes");
    expect(nextWasCalled).toBe(true);

    logSpy.mockRestore();
  });

  // Test 2: Object based arrange.
  test("UT-002: Suggestion without description fails validation", () => {

    // Arrange
    const sugerencia = new Sugerencia({
      nombreUsuario: "Jimena",
      tituloAnime: "Naruto"
    });

    // Act
    const validationError = sugerencia.validateSync();

    // Assert
    expect(validationError.errors.descripcion).toBeDefined();
    expect(validationError.errors.descripcion.kind).toBe("required");
    expect(sugerencia.nombreUsuario).toBe("Jimena");
  });

  // Test 3: Mock based arrange.
  test("UT-003: Searching an anime with a non-existent ID returns 404 and deletes nothing", async () => {

    // Arrange
    Anime.findById.mockResolvedValue(null);
    const req = { params: { id: "1234" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Act
    await animeController.obtenerAnimePorId(req, res);

    // Assert
    expect(Anime.findById).toHaveBeenCalledWith("1234");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Anime no encontrado" });
    expect(Anime.findByIdAndDelete).not.toHaveBeenCalled();
  });

});