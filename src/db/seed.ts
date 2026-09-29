import { eq } from "drizzle-orm";

import { db } from "@/db";
import { seguidores, temas, type NewSeguidor, type NewTema } from "@/db/schema";

const TEMAS_SEED: NewTema[] = [
  {
    id: "tema-marineford",
    nombre: "Arco de Marineford",
    tipo: "arco",
    descripcion: "La guerra en Marineford y sus consecuencias para la tripulación.",
    temporada: "Summit War",
    relevancia: 5,
  },
  {
    id: "tema-enies-lobby",
    nombre: "Arco de Enies Lobby",
    tipo: "arco",
    descripcion: "El rescate de Robin y la declaración de guerra al Gobierno Mundial.",
    temporada: "Water 7",
    relevancia: 5,
  },
  {
    id: "tema-wano",
    nombre: "Arco de Wano",
    tipo: "arco",
    descripcion: "La alianza samurái contra Kaido y Big Mom en el país de Wano.",
    temporada: "Wano",
    relevancia: 5,
  },
  {
    id: "tema-dressrosa",
    nombre: "Arco de Dressrosa",
    tipo: "arco",
    descripcion: "La caída de Doflamingo y la liberación del reino de Dressrosa.",
    temporada: "Dressrosa",
    relevancia: 4,
  },
  {
    id: "tema-skypiea",
    nombre: "Arco de Skypiea",
    tipo: "arco",
    descripcion: "La isla del cielo, Enel y la ciudad dorada de Shandora.",
    temporada: "Skypiea",
    relevancia: 3,
  },
  {
    id: "tema-luffy",
    nombre: "Personaje Monkey D. Luffy",
    tipo: "personaje",
    descripcion: "El capitán de los Sombrero de Paja y su camino a ser el Rey de los Piratas.",
    temporada: "General",
    relevancia: 5,
  },
  {
    id: "tema-figura-gear5",
    nombre: "Figura de Luffy Gear 5",
    tipo: "producto",
    descripcion: "Figura coleccionable del despertar de la fruta Hito Hito no Mi, modelo Nika.",
    temporada: "Wano",
    relevancia: 4,
  },
];

const SEGUIDORES_SEED: NewSeguidor[] = [
  { id: "user-soyluffy", nombreUsuario: "soyluffy" },
  { id: "user-nami-cartografa", nombreUsuario: "nami_cartografa" },
  { id: "user-zoro-santoryu", nombreUsuario: "zoro_santoryu" },
  { id: "user-robin-arqueologa", nombreUsuario: "robin_arqueologa" },
  { id: "user-sanji-cocina", nombreUsuario: "sanji_cocina" },
];

async function backfillTemasExploracion(): Promise<void> {
  const pendientes = await db
    .select({ id: temas.id })
    .from(temas)
    .where(eq(temas.temporada, ""))
    .limit(1);

  if (pendientes.length === 0) return;

  for (const tema of TEMAS_SEED) {
    await db
      .update(temas)
      .set({ temporada: tema.temporada, relevancia: tema.relevancia })
      .where(eq(temas.id, tema.id));
  }
}

export async function ensureSeedData(): Promise<void> {
  const temasExistentes = await db.select({ id: temas.id }).from(temas).limit(1);
  if (temasExistentes.length === 0) {
    await db.insert(temas).values(TEMAS_SEED);
  } else {
    await backfillTemasExploracion();
  }

  const seguidoresExistentes = await db.select({ id: seguidores.id }).from(seguidores).limit(1);
  if (seguidoresExistentes.length === 0) {
    await db.insert(seguidores).values(SEGUIDORES_SEED);
  }
}
