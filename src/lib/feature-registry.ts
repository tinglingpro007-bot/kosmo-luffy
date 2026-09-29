import type { FeatureGroup, FeatureManifest } from "@/features/types";
import { manifest as resenasManifest } from "@/features/escribir-resenas-de-temas/manifest";

export const features: FeatureManifest[] = [resenasManifest];
export const featureGroups: FeatureGroup[] = [
  {
    label: "Navegación",
    features: [resenasManifest],
  },
];
