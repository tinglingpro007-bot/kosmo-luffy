export type { Tema } from "@/db/schema";

export type TipoTema = "arco" | "personaje" | "producto";

export const TIPOS_TEMA: readonly TipoTema[] = ["arco", "personaje", "producto"];

export const TIPO_TEMA_LABEL: Record<TipoTema, string> = {
  arco: "Arco",
  personaje: "Personaje",
  producto: "Producto",
};

export function tipoTemaLabel(tipo: string): string {
  return TIPO_TEMA_LABEL[tipo as TipoTema] ?? tipo;
}

export const TEMPORADAS = [
  "East Blue",
  "Arabasta",
  "Skypiea",
  "Water 7",
  "Thriller Bark",
  "Summit War",
  "Dressrosa",
  "Whole Cake",
  "Wano",
  "General",
] as const;

export type Temporada = (typeof TEMPORADAS)[number];

export const TODAS_LAS_TEMPORADAS = "todas";

export const RELEVANCIA_MIN = 1;
export const RELEVANCIA_MAX = 5;

const RELEVANCIA_LABEL: Record<number, string> = {
  5: "Muy alta",
  4: "Alta",
  3: "Media",
  2: "Baja",
  1: "Muy baja",
};

export function relevanciaLabel(valor: number): string {
  return RELEVANCIA_LABEL[valor] ?? "Media";
}

export type CriterioOrden = "alfabetico" | "relevancia";

export interface TemaExploracion {
  id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  temporada: string;
  relevancia: number;
  totalResenas: number;
}
