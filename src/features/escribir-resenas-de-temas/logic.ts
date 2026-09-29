import {
  VALORACION_MAX,
  VALORACION_MIN,
  type ResenaView,
} from "@/domain/resenas";

export interface NuevaResenaInput {
  autorId: string;
  temaId: string;
  titulo: string;
  cuerpo: string;
  valoracion?: number | string | null;
}

export type CampoResena = "autor" | "tema" | "titulo" | "cuerpo" | "valoracion";

export interface ErrorResena {
  campo: CampoResena;
  mensaje: string;
}

export interface ValidacionResena {
  valido: boolean;
  errores: ErrorResena[];
  mensaje?: string;
}

export interface CreateResenaResult {
  success: boolean;
  error?: string;
  fieldErrors?: ErrorResena[];
}

export const MSG_TITULO_CUERPO = "Complete el título y el cuerpo de la reseña";
export const MSG_TEMA = "Debe seleccionar un tema para su reseña";
export const MSG_AUTOR = "Seleccione el autor que firma la reseña";
export const MSG_VALORACION = `La valoración debe ser un número entre ${VALORACION_MIN} y ${VALORACION_MAX}`;

function esTextoVacio(valor: unknown): boolean {
  return typeof valor !== "string" || valor.trim().length === 0;
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
  const errores: ErrorResena[] = [];

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
    input.valoracion !== null &&
    input.valoracion !== undefined &&
    input.valoracion !== "";

  if (hayValoracion && normalizeValoracion(input.valoracion) === null) {
    return {
      valido: false,
      errores: [{ campo: "valoracion", mensaje: MSG_VALORACION }],
      mensaje: MSG_VALORACION,
    };
  }

  return { valido: true, errores: [] };
}

export function sortResenasRecientes(resenas: ResenaView[]): ResenaView[] {
  return [...resenas].sort(
    (a, b) => new Date(b.creadaEn).getTime() - new Date(a.creadaEn).getTime(),
  );
}

export function valoracionTexto(valoracion: number | null): string | null {
  return valoracion === null ? null : `${valoracion} / ${VALORACION_MAX}`;
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
