"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { resenas } from "@/db/schema";
import { ensureSeedData } from "@/db/seed";
import {
  normalizeValoracion,
  validateNuevaResena,
  type CreateResenaResult,
  type NuevaResenaInput,
} from "./logic";

export async function createResenaAction(
  input: NuevaResenaInput,
): Promise<CreateResenaResult> {
  const validacion = validateNuevaResena(input);
  if (!validacion.valido) {
    return {
      success: false,
      error: validacion.mensaje,
      fieldErrors: validacion.errores,
    };
  }

  try {
    await ensureSeedData();
    await db.insert(resenas).values({
      id: crypto.randomUUID(),
      temaId: input.temaId,
      autorId: input.autorId,
      titulo: input.titulo.trim(),
      cuerpo: input.cuerpo.trim(),
      valoracion: normalizeValoracion(input.valoracion),
      createdAt: new Date(),
    });

    revalidatePath("/escribir-resenas-de-temas");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
