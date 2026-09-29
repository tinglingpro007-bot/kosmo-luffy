import { PenLine } from "lucide-react";

import type { FeatureManifest } from "@/features/types";

export const manifest: FeatureManifest = {
  slug: "escribir-resenas-de-temas",
  title: "Reseñas de temas",
  description:
    "Publica tu opinión sobre arcos, personajes y productos de One Piece y lee las reseñas que comparte la comunidad.",
  route: "/escribir-resenas-de-temas",
  icon: PenLine,
  group: "Navegación",
  actor: "Fan reseñador",
};
