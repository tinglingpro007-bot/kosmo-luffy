import type { FeatureGroup, FeatureManifest } from "@/features/types";
import { manifest as resenasManifest } from "@/features/escribir-resenas-de-temas/manifest";
import { manifest as explorarTemasManifest } from "@/features/explorar-temas-de-la-serie/manifest";

export const features: FeatureManifest[] = [explorarTemasManifest, resenasManifest];
export const featureGroups: FeatureGroup[] = [
  {
    label: "Navegación",
    features: [explorarTemasManifest, resenasManifest],
  },
];
