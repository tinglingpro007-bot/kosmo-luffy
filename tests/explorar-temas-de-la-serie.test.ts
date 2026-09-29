import { describe, expect, it } from "vitest";

import type { TemaExploracion } from "@/domain/temas";
import {
  MSG_AUTOR,
  MSG_SIN_RESULTADOS,
  MSG_TEMA,
  MSG_TITULO_CUERPO,
  MSG_VALORACION,
  aplicarConteos,
  construirListado,
  contadorResenas,
  filtrarPorTemporada,
  formatFecha,
  normalizeValoracion,
  ordenarTemas,
  validateNuevaResena,
  type NuevaResenaInput,
} from "@/features/explorar-temas-de-la-serie/logic";

function aTema(overrides: Partial<TemaExploracion> = {}): TemaExploracion {
  return {
    id: "tema-marineford",
    nombre: "Arco de Marineford",
    tipo: "arco",
    descripcion: "La guerra en Marineford.",
    temporada: "Summit War",
    relevancia: 5,
    totalResenas: 0,
    ...overrides,
  };
}

function unInput(overrides: Partial<NuevaResenaInput> = {}): NuevaResenaInput {
  return {
    temaId: "tema-marineford",
    autorId: "user-soyluffy",
    titulo: "Un arco inolvidable",
    cuerpo: "Cambió el rumbo de la serie.",
    valoracion: "",
    ...overrides,
  };
}

describe("filtrarPorTemporada", () => {
  it("returns only topics of the selected season", () => {
    // Arrange
    const temas = [
      aTema({ id: "1", temporada: "Wano" }),
      aTema({ id: "2", temporada: "Skypiea" }),
      aTema({ id: "3", temporada: "Wano" }),
    ];

    // Act
    const resultado = filtrarPorTemporada(temas, "Wano");

    // Assert
    expect(resultado.map((tema) => tema.id)).toEqual(["1", "3"]);
  });

  it("returns every topic when the filter is 'todas'", () => {
    // Arrange
    const temas = [aTema({ id: "1", temporada: "Wano" }), aTema({ id: "2", temporada: "Skypiea" })];

    // Act
    const resultado = filtrarPorTemporada(temas, "todas");

    // Assert
    expect(resultado).toHaveLength(2);
  });

  it("returns an empty list when no topic matches the season", () => {
    // Arrange
    const temas = [aTema({ id: "1", temporada: "Wano" })];

    // Act
    const resultado = filtrarPorTemporada(temas, "East Blue");

    // Assert
    expect(resultado).toHaveLength(0);
  });

  it("does not mutate the original list", () => {
    // Arrange
    const temas = [aTema({ id: "1" }), aTema({ id: "2" })];

    // Act
    filtrarPorTemporada(temas, "Wano");

    // Assert
    expect(temas).toHaveLength(2);
  });
});

describe("ordenarTemas", () => {
  it("sorts alphabetically by title", () => {
    // Arrange
    const temas = [
      aTema({ id: "z", nombre: "Zou" }),
      aTema({ id: "a", nombre: "Arabasta" }),
      aTema({ id: "m", nombre: "Marineford" }),
    ];

    // Act
    const resultado = ordenarTemas(temas, "alfabetico");

    // Assert
    expect(resultado.map((tema) => tema.nombre)).toEqual(["Arabasta", "Marineford", "Zou"]);
  });

  it("sorts by relevance from highest to lowest", () => {
    // Arrange
    const temas = [
      aTema({ id: "baja", nombre: "B", relevancia: 2 }),
      aTema({ id: "alta", nombre: "A", relevancia: 5 }),
      aTema({ id: "media", nombre: "C", relevancia: 3 }),
    ];

    // Act
    const resultado = ordenarTemas(temas, "relevancia");

    // Assert
    expect(resultado.map((tema) => tema.id)).toEqual(["alta", "media", "baja"]);
  });

  it("breaks relevance ties alphabetically", () => {
    // Arrange
    const temas = [
      aTema({ id: "1", nombre: "Zou", relevancia: 5 }),
      aTema({ id: "2", nombre: "Arabasta", relevancia: 5 }),
    ];

    // Act
    const resultado = ordenarTemas(temas, "relevancia");

    // Assert
    expect(resultado.map((tema) => tema.nombre)).toEqual(["Arabasta", "Zou"]);
  });
});

describe("construirListado", () => {
  it("combines the season filter and the ordering", () => {
    // Arrange
    const temas = [
      aTema({ id: "1", nombre: "Zou", temporada: "Wano", relevancia: 3 }),
      aTema({ id: "2", nombre: "Arabasta", temporada: "Wano", relevancia: 5 }),
      aTema({ id: "3", nombre: "Skypiea", temporada: "Skypiea", relevancia: 5 }),
    ];

    // Act
    const resultado = construirListado(temas, { temporada: "Wano", orden: "relevancia" });

    // Assert
    expect(resultado.map((tema) => tema.id)).toEqual(["2", "1"]);
  });

  it("returns an empty list when the filter has no matches", () => {
    // Arrange
    const temas = [aTema({ id: "1", temporada: "Wano" })];

    // Act
    const resultado = construirListado(temas, { temporada: "East Blue", orden: "alfabetico" });

    // Assert
    expect(resultado).toHaveLength(0);
    expect(MSG_SIN_RESULTADOS).toContain("No se encontraron temas");
  });
});

describe("aplicarConteos", () => {
  it("updates the review count of the affected topic", () => {
    // Arrange
    const temas = [aTema({ id: "dressrosa", totalResenas: 3 }), aTema({ id: "wano", totalResenas: 1 })];

    // Act
    const resultado = aplicarConteos(temas, { dressrosa: 4 });

    // Assert
    expect(resultado.find((tema) => tema.id === "dressrosa")?.totalResenas).toBe(4);
    expect(resultado.find((tema) => tema.id === "wano")?.totalResenas).toBe(1);
  });

  it("keeps the previous count when a topic is absent from the new counts", () => {
    // Arrange
    const temas = [aTema({ id: "dressrosa", totalResenas: 3 })];

    // Act
    const resultado = aplicarConteos(temas, {});

    // Assert
    expect(resultado[0]?.totalResenas).toBe(3);
  });
});

describe("contadorResenas", () => {
  const casos: Array<[number, string]> = [
    [0, "Sin reseñas"],
    [1, "1 reseña"],
    [4, "4 reseñas"],
  ];

  it.each(casos)("contadorResenas(%i) => %s", (total, esperado) => {
    // Arrange & Act & Assert
    expect(contadorResenas(total)).toBe(esperado);
  });
});

describe("validateNuevaResena", () => {
  it("accepts a complete review", () => {
    // Arrange & Act
    const resultado = validateNuevaResena(unInput({ valoracion: 4 }));

    // Assert
    expect(resultado.valido).toBe(true);
    expect(resultado.errores).toHaveLength(0);
  });

  it("accepts a review without rating", () => {
    // Arrange & Act
    const resultado = validateNuevaResena(unInput({ valoracion: "" }));

    // Assert
    expect(resultado.valido).toBe(true);
  });

  it("rejects a review without a topic", () => {
    // Arrange & Act
    const resultado = validateNuevaResena(unInput({ temaId: "" }));

    // Assert
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toBe(MSG_TEMA);
  });

  it("rejects a review without an author", () => {
    // Arrange & Act
    const resultado = validateNuevaResena(unInput({ autorId: "" }));

    // Assert
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toBe(MSG_AUTOR);
  });

  it("rejects a review with an empty body", () => {
    // Arrange & Act
    const resultado = validateNuevaResena(unInput({ cuerpo: "   " }));

    // Assert
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toBe(MSG_TITULO_CUERPO);
  });

  it("rejects an out-of-range rating", () => {
    // Arrange & Act
    const resultado = validateNuevaResena(unInput({ valoracion: 9 }));

    // Assert
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toBe(MSG_VALORACION);
  });
});

describe("normalizeValoracion", () => {
  const casos: Array<[number | string | null, number | null]> = [
    [3, 3],
    ["5", 5],
    ["", null],
    [null, null],
    [0, null],
    [6, null],
  ];

  it.each(casos)("normalizeValoracion(%s) => %s", (input, esperado) => {
    // Arrange & Act
    const resultado = normalizeValoracion(input);

    // Assert
    expect(resultado).toBe(esperado);
  });
});

describe("formatFecha", () => {
  it("formats an ISO date in Spanish", () => {
    // Arrange & Act
    const resultado = formatFecha("2026-01-15T00:00:00.000Z");

    // Assert
    expect(resultado).toContain("2026");
  });

  it("returns an empty string for an invalid date", () => {
    // Arrange & Act & Assert
    expect(formatFecha("no-es-fecha")).toBe("");
  });
});
