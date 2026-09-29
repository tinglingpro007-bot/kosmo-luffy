import { VALORACION_MAX, VALORACION_MIN } from "@/domain/resenas";
import {
  TODAS_LAS_TEMPORADAS,
  type CriterioOrden,
  type TemaExploracion,
} from "@/domain/temas";

export const MSG_SIN_RESULTADOS = "No se encontraron temas con los filtros seleccionados";
export const MSG_TITULO_CUERPO = "Complete el título y el cuerpo de la reseña";
export const MSG_TEMA = "Debe seleccionar un tema para su reseña";
export const MSG_AUTOR = "Seleccione el autor que firma la reseña";
export const MSG_VALORACION = `La valoración debe ser un número entre ${VALORACION_MIN} y ${VALORACION_MAX}`;

export interface FiltrosTemas {
  temporada: string;
  orden: CriterioOrden;
}

export interface NuevaResenaInput {
  temaId: string;
  autorId: string;
  titulo: string;
  cuerpo: string;
  valoracion?: number | string | null;
}

export type CampoResena = "tema" | "autor" | "titulo" | "cuerpo" | "valoracion";

export interface ErrorCampo {
  campo: CampoResena;
  mensaje: string;
}

export interface ValidacionResena {
  valido: boolean;
  errores: ErrorCampo[];
  mensaje?: string;
}

export interface CreateResenaResult {
  success: boolean;
  error?: string;
  fieldErrors?: ErrorCampo[];
}

export interface ConteosResult {
  success: boolean;
  conteos: Record<string, number>;
}

function esTextoVacio(valor: unknown): boolean {
  return typeof valor !== "string" || valor.trim().length === 0;
}

export function filtrarPorTemporada(
  temas: TemaExploracion[],
  temporada: string,
): TemaExploracion[] {
  if (!temporada || temporada === TODAS_LAS_TEMPORADAS) {
    return [...temas];
  }
  return temas.filter((tema) => tema.temporada === temporada);
}

export function ordenarTemas(
  temas: TemaExploracion[],
  orden: CriterioOrden,
): TemaExploracion[] {
  const copia = [...temas];
  if (orden === "relevancia") {
    return copia.sort(
      (a, b) =>
        b.relevancia - a.relevancia || a.nombre.localeCompare(b.nombre, "es"),
    );
  }
  return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export function construirListado(
  temas: TemaExploracion[],
  filtros: FiltrosTemas,
): TemaExploracion[] {
  return ordenarTemas(filtrarPorTemporada(temas, filtros.temporada), filtros.orden);
}

export function aplicarConteos(
  temas: TemaExploracion[],
  conteos: Record<string, number>,
): TemaExploracion[] {
  return temas.map((tema) => ({
    ...tema,
    totalResenas: conteos[tema.id] ?? tema.totalResenas,
  }));
}

export function contadorResenas(total: number): string {
  if (total <= 0) {
    return "Sin reseñas";
  }
  return total === 1 ? "1 reseña" : `${total} reseñas`;
}

export function normalizeValoracion(
  valor: number | string | null | undefined,
): number | null {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  const numero = typeof valor === "string" ? Number(valor) : valor;
  if (!Number.isFinite(numero)) {
    return null;
  }
  const entero = Math.trunc(numero);
  if (entero < VALORACION_MIN || entero > VALORACION_MAX) {
    return null;
  }
  return entero;
}

export function validateNuevaResena(input: NuevaResenaInput): ValidacionResena {
  const errores: ErrorCampo[] = [];

  if (esTextoVacio(input.titulo)) {
    errores.push({ campo: "titulo", mensaje: MSG_TITULO_CUERPO });
  }
  if (esTextoVacio(input.cuerpo)) {
    errores.push({ campo: "cuerpo", mensaje: MSG_TITULO_CUERPO });
  }

  if (errores.length > 0) {
    return { valido: false, errores, mensaje: MSG_TITULO_CUERPO };
  }

  if (esTextoVacio(input.temaId)) {
    return {
      valido: false,
      errores: [{ campo: "tema", mensaje: MSG_TEMA }],
      mensaje: MSG_TEMA,
    };
  }

  if (esTextoVacio(input.autorId)) {
    return {
      valido: false,
      errores: [{ campo: "autor", mensaje: MSG_AUTOR }],
      mensaje: MSG_AUTOR,
    };
  }

  const hayValoracion =
    input.valoracion !== null && input.valoracion !== undefined && input.valoracion !== "";

  if (hayValoracion && normalizeValoracion(input.valoracion) === null) {
    return {
      valido: false,
      errores: [{ campo: "valoracion", mensaje: MSG_VALORACION }],
      mensaje: MSG_VALORACION,
    };
  }

  return { valido: true, errores: [] };
}

export function formatFecha(iso: string): string {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) {
    return "";
  }
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
