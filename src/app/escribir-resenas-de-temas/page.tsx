import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { resenas, seguidores, temas } from "@/db/schema";
import { ensureSeedData } from "@/db/seed";
import type { ResenaView } from "@/domain/resenas";
import { ResenasView } from "@/features/escribir-resenas-de-temas/components/ResenasView";

export const dynamic = "force-dynamic";

export default async function EscribirResenasPage() {
  await ensureSeedData();

  const [temasRows, seguidoresRows, resenasRows] = await Promise.all([
    db.select().from(temas).orderBy(temas.nombre),
    db.select().from(seguidores).orderBy(seguidores.nombreUsuario),
    db
      .select({
        id: resenas.id,
        temaId: resenas.temaId,
        temaNombre: temas.nombre,
        temaTipo: temas.tipo,
        autorId: resenas.autorId,
        autorNombre: seguidores.nombreUsuario,
        titulo: resenas.titulo,
        cuerpo: resenas.cuerpo,
        valoracion: resenas.valoracion,
        createdAt: resenas.createdAt,
      })
      .from(resenas)
      .innerJoin(temas, eq(resenas.temaId, temas.id))
      .innerJoin(seguidores, eq(resenas.autorId, seguidores.id))
      .orderBy(desc(resenas.createdAt)),
  ]);

  const resenasView: ResenaView[] = resenasRows.map((resena) => ({
    id: resena.id,
    temaId: resena.temaId,
    temaNombre: resena.temaNombre,
    temaTipo: resena.temaTipo,
    autorId: resena.autorId,
    autorNombre: resena.autorNombre,
    titulo: resena.titulo,
    cuerpo: resena.cuerpo,
    valoracion: resena.valoracion,
    creadaEn: resena.createdAt.toISOString(),
  }));

  return (
    <ResenasView
      temas={temasRows.map((tema) => ({
        id: tema.id,
        nombre: tema.nombre,
        tipo: tema.tipo,
      }))}
      seguidores={seguidoresRows.map((seguidor) => ({
        id: seguidor.id,
        nombreUsuario: seguidor.nombreUsuario,
      }))}
      resenas={resenasView}
    />
  );
}
