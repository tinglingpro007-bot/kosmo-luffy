import { describe, expect, it } from "vitest";

import type { ResenaView } from "@/domain/resenas";
import {
  MSG_AUTOR,
  MSG_TEMA,
  MSG_TITULO_CUERPO,
  MSG_VALORACION,
  formatFecha,
  normalizeValoracion,
  sortResenasRecientes,
  validateNuevaResena,
  valoracionTexto,
  type NuevaResenaInput,
} from "@/features/escribir-resenas-de-temas/logic";

function aResena(overrides: Partial<ResenaView> = {}): ResenaView {
  return {
    id: "resena-1",
    temaId: "tema-marineford",
    temaNombre: "Arco de Marineford",
    temaTipo: "arco",
    autorId: "user-soyluffy",
    autorNombre: "soyluffy",
    titulo: "Una guerra inolvidable",
    cuerpo: "El arco cambió por completo el rumbo de la serie.",
    valoracion: null,
    creadaEn: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function anInput(overrides: Partial<NuevaResenaInput> = {}): NuevaResenaInput {
  return {
    autorId: "user-soyluffy",
    temaId: "tema-marineford",
    titulo: "Análisis de Marineford",
    cuerpo: "La mejor batalla de toda la serie.",
    valoracion: "",
    ...overrides,
  };
}

describe("validateNuevaResena", () => {
  it("accepts a complete review with rating", () => {
    // Arrange
    const input = anInput({ valoracion: 4 });

    // Act
    const result = validateNuevaResena(input);

    // Assert
    expect(result.valido).toBe(true);
    expect(result.errores).toHaveLength(0);
  });

  it("accepts a review without rating", () => {
    // Arrange
    const input = anInput({ valoracion: "" });

    // Act
    const result = validateNuevaResena(input);

    // Assert
    expect(result.valido).toBe(true);
  });

  it("rejects a review without a selected topic", () => {
    // Arrange
    const input = anInput({ temaId: "" });

    // Act
    const result = validateNuevaResena(input);

    // Assert
    expect(result.valido).toBe(false);
    expect(result.mensaje).toBe(MSG_TEMA);
    expect(result.errores[0]?.campo).toBe("tema");
  });

  it("rejects a review with an empty body", () => {
    // Arrange
    const input = anInput({ cuerpo: "" });

    // Act
    const result = validateNuevaResena(input);

    // Assert
    expect(result.valido).toBe(false);
    expect(result.mensaje).toBe(MSG_TITULO_CUERPO);
    expect(result.errores.some((error) => error.campo === "cuerpo")).toBe(true);
  });

  it("rejects a review with an empty title", () => {
    // Arrange
    const input = anInput({ titulo: "" });

    // Act
    const result = validateNuevaResena(input);

    // Assert
    expect(result.valido).toBe(false);
    expect(result.errores.some((error) => error.campo === "titulo")).toBe(true);
  });

  it("treats whitespace-only fields as empty", () => {
    // Arrange
    const input = anInput({ titulo: "   ", cuerpo: "   " });

    // Act
    const result = validateNuevaResena(input);

    // Assert
    expect(result.valido).toBe(false);
    expect(result.errores).toHaveLength(2);
  });

  it("prioritizes title and body errors over the missing topic", () => {
    // Arrange
    const input = anInput({ titulo: "", cuerpo: "", temaId: "" });

    // Act
    const result = validateNuevaResena(input);

    // Assert
    expect(result.mensaje).toBe(MSG_TITULO_CUERPO);
  });

  it("rejects a review without a signing author", () => {
    // Arrange
    const input = anInput({ autorId: "" });

    // Act
    const result = validateNuevaResena(input);

    // Assert
    expect(result.valido).toBe(false);
    expect(result.mensaje).toBe(MSG_AUTOR);
  });

  it("rejects an out-of-range rating", () => {
    // Arrange
    const input = anInput({ valoracion: 6 });

    // Act
    const result = validateNuevaResena(input);

    // Assert
    expect(result.valido).toBe(false);
    expect(result.mensaje).toBe(MSG_VALORACION);
  });
});

describe("normalizeValoracion", () => {
  const casos: Array<[number | string | null | undefined, number | null]> = [
    [1, 1],
    [5, 5],
    ["4", 4],
    ["", null],
    [null, null],
    [undefined, null],
    [0, null],
    [6, null],
    ["abc", null],
  ];

  it.each(casos)("normalizeValoracion(%s) => %s", (input, expected) => {
    // Arrange & Act
    const result = normalizeValoracion(input);

    // Assert
    expect(result).toBe(expected);
  });
});

describe("sortResenasRecientes", () => {
  it("orders reviews from newest to oldest", () => {
    // Arrange
    const antigua = aResena({ id: "a", creadaEn: "2026-01-01T00:00:00.000Z" });
    const reciente = aResena({ id: "b", creadaEn: "2026-03-01T00:00:00.000Z" });
    const intermedia = aResena({ id: "c", creadaEn: "2026-02-01T00:00:00.000Z" });

    // Act
    const result = sortResenasRecientes([antigua, reciente, intermedia]);

    // Assert
    expect(result.map((resena) => resena.id)).toEqual(["b", "c", "a"]);
  });

  it("keeps every review of the same topic without replacing any", () => {
    // Arrange
    const resenas = [
      aResena({ id: "1", temaId: "tema-marineford", creadaEn: "2026-01-01T00:00:00.000Z" }),
      aResena({ id: "2", temaId: "tema-marineford", creadaEn: "2026-02-01T00:00:00.000Z" }),
      aResena({ id: "3", temaId: "tema-marineford", creadaEn: "2026-03-01T00:00:00.000Z" }),
    ];

    // Act
    const result = sortResenasRecientes(resenas);

    // Assert
    expect(result).toHaveLength(3);
    expect(result[0]?.id).toBe("3");
  });

  it("does not mutate the original array", () => {
    // Arrange
    const original = [
      aResena({ id: "a", creadaEn: "2026-01-01T00:00:00.000Z" }),
      aResena({ id: "b", creadaEn: "2026-02-01T00:00:00.000Z" }),
    ];

    // Act
    sortResenasRecientes(original);

    // Assert
    expect(original.map((resena) => resena.id)).toEqual(["a", "b"]);
  });
});

describe("valoracionTexto", () => {
  it("formats a rating over five", () => {
    // Arrange & Act & Assert
    expect(valoracionTexto(4)).toBe("4 / 5");
  });

  it("returns null when there is no rating", () => {
    // Arrange & Act & Assert
    expect(valoracionTexto(null)).toBeNull();
  });
});

describe("formatFecha", () => {
  it("formats an ISO date in Spanish", () => {
    // Arrange & Act
    const result = formatFecha("2026-01-15T00:00:00.000Z");

    // Assert
    expect(result).toContain("2026");
    expect(result).not.toBe("");
  });

  it("returns an empty string for an invalid date", () => {
    // Arrange & Act & Assert
    expect(formatFecha("no-es-fecha")).toBe("");
  });
});
