// Database schema definitions using Drizzle ORM (SQLite)

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const temas = sqliteTable("temas", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  tipo: text("tipo").notNull().default("arco"),
  descripcion: text("descripcion").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const seguidores = sqliteTable("seguidores", {
  id: text("id").primaryKey(),
  nombreUsuario: text("nombre_usuario").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const resenas = sqliteTable("resenas", {
  id: text("id").primaryKey(),
  temaId: text("tema_id")
    .notNull()
    .references(() => temas.id),
  autorId: text("autor_id")
    .notNull()
    .references(() => seguidores.id),
  titulo: text("titulo").notNull(),
  cuerpo: text("cuerpo").notNull(),
  valoracion: integer("valoracion"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Tema = typeof temas.$inferSelect;
export type NewTema = typeof temas.$inferInsert;
export type Seguidor = typeof seguidores.$inferSelect;
export type NewSeguidor = typeof seguidores.$inferInsert;
export type Resena = typeof resenas.$inferSelect;
export type NewResena = typeof resenas.$inferInsert;
