export interface DesignTokens {
  brand: {
    personality: string;
    domain: string;
  };
  colors: {
    primary: string;
    primaryRgb: string;
    secondary: string;
    secondaryRgb: string;
    success: string;
    successRgb: string;
    warning: string;
    warningRgb: string;
    danger: string;
    dangerRgb: string;
    accent: string;
    accentRgb: string;
    bodyBg: string;
    cardBg: string;
    mutedBg: string;
    mutedText: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    fontFamily: string;
    fontHeading: string;
  };
  shape: {
    radius: string;
    radiusSm: string;
    radiusLg: string;
    shadowSm: string;
    shadow: string;
    shadowLg: string;
  };
  layout: {
    shell: string;
    density: string;
  };
}

export const designTokens: DesignTokens = {
  brand: {
    personality: "energético, fresco, confiable",
    domain: "storefront",
  },
  colors: {
    primary: "#008367",
    primaryRgb: "0, 131, 103",
    secondary: "#816b72",
    secondaryRgb: "129, 107, 114",
    success: "#36912e",
    successRgb: "54, 145, 46",
    warning: "#cd8800",
    warningRgb: "205, 136, 0",
    danger: "#cc2827",
    dangerRgb: "204, 40, 39",
    accent: "#008fc0",
    accentRgb: "0, 143, 192",
    bodyBg: "#f5fcfa",
    cardBg: "#ffffff",
    mutedBg: "#e5f2ee",
    mutedText: "#64748b",
    border: "#e2e8f0",
    text: "#1e293b",
    textSecondary: "#475569",
  },
  typography: {
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif",
    fontHeading: "system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif",
  },
  shape: {
    radius: "0.75rem",
    radiusSm: "0.375rem",
    radiusLg: "1rem",
    shadowSm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    shadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    shadowLg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
  },
  layout: {
    shell: "sidebar",
    density: "comfortable",
  },
};
