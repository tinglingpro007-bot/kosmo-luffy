import { Compass } from "lucide-react";

import type { FeatureManifest } from "@/features/types";

export const manifest: FeatureManifest = {
  slug: "explorar-temas-de-la-serie",
  title: "Explorar temas",
  description:
    "Recorre los arcos, personajes y productos de One Piece, filtra por temporada y descubre qué opina la comunidad de cada tema.",
  route: "/explorar-temas-de-la-serie",
  icon: Compass,
  group: "Navegación",
  actor: "Visitante",
};
