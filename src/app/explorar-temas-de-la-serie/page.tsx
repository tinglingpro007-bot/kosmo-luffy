import { count, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { resenas, seguidores, temas } from "@/db/schema";
import { ensureSeedData } from "@/db/seed";
import type { ResenaView } from "@/domain/resenas";
import { TEMPORADAS, type TemaExploracion } from "@/domain/temas";
import { ExplorarTemasView } from "@/features/explorar-temas-de-la-serie/components/ExplorarTemasView";

export const dynamic = "force-dynamic";

export default async function ExplorarTemasDeLaSeriePage() {
  await ensureSeedData();

  const [temasRows, resenasRows, seguidoresRows] = await Promise.all([
    db
      .select({
        id: temas.id,
        nombre: temas.nombre,
        tipo: temas.tipo,
        descripcion: temas.descripcion,
        temporada: temas.temporada,
        relevancia: temas.relevancia,
        totalResenas: count(resenas.id),
      })
      .from(temas)
      .leftJoin(resenas, eq(resenas.temaId, temas.id))
      .groupBy(temas.id)
      .orderBy(temas.nombre),
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
    db.select().from(seguidores).orderBy(seguidores.nombreUsuario),
  ]);

  const temasView: TemaExploracion[] = temasRows.map((tema) => ({
    id: tema.id,
    nombre: tema.nombre,
    tipo: tema.tipo,
    descripcion: tema.descripcion,
    temporada: tema.temporada,
    relevancia: tema.relevancia,
    totalResenas: Number(tema.totalResenas),
  }));

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
    <ExplorarTemasView
      temas={temasView}
      resenas={resenasView}
      seguidores={seguidoresRows.map((seguidor) => ({
        id: seguidor.id,
        nombreUsuario: seguidor.nombreUsuario,
      }))}
      temporadas={TEMPORADAS}
    />
  );
}
