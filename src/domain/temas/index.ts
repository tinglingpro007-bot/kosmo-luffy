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
