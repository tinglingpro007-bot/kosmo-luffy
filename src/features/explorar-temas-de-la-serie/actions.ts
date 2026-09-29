"use server";

import { revalidatePath } from "next/cache";
import { count } from "drizzle-orm";

import { db } from "@/db";
import { resenas } from "@/db/schema";
import { ensureSeedData } from "@/db/seed";
import {
  normalizeValoracion,
  validateNuevaResena,
  type ConteosResult,
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

    revalidatePath("/explorar-temas-de-la-serie");
    revalidatePath("/escribir-resenas-de-temas");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function fetchTemasResumenAction(): Promise<ConteosResult> {
  try {
    const filas = await db
      .select({ temaId: resenas.temaId, total: count() })
      .from(resenas)
      .groupBy(resenas.temaId);

    const conteos: Record<string, number> = {};
    for (const fila of filas) {
      conteos[fila.temaId] = Number(fila.total);
    }

    return { success: true, conteos };
  } catch {
    return { success: false, conteos: {} };
  }
}
