export type { NewResena, Resena } from "@/db/schema";

export const VALORACION_MIN = 1;
export const VALORACION_MAX = 5;

export interface ResenaView {
  id: string;
  temaId: string;
  temaNombre: string;
  temaTipo: string;
  autorId: string;
  autorNombre: string;
  titulo: string;
  cuerpo: string;
  valoracion: number | null;
  creadaEn: string;
}
