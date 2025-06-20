// src/contexts/PDFThemeContext.tsx
"use client";

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';

// Define the structure of the theme for type safety
export interface PDFTheme {
  colors: {
    primary: [number, number, number];
    accent: [number, number, number];
    foreground: [number, number, number];
    mutedForeground: [number, number, number];
    background: [number, number, number];
    cardBg: [number, number, number];
    border: [number, number, number];
    gray: { bg: [number, number, number]; border: [number, number, number]; };
    yellow: { bg: [number, number, number]; border: [number, number, number]; title: [number, number, number]; };
    sectionBlue: { bg: [number, number, number]; border: [number, number, number]; title: [number, number, number]; };
    sectionGreen: { bg: [number, number, number]; border: [number, number, number]; title: [number, number, number]; };
    sectionOrange: { bg: [number, number, number]; border: [number, number, number]; title: [number, number, number]; };
  };
  styles: {
    fontFamily: string;
    pageMargins: { top: number; bottom: number; left: number; right: number; };
    lineHeightFactor: number;
    paragraphSpacing: number;
    sectionSpacing: number;
    titleSize: number;
    subtitleSize: number;
    h2Size: number;
    h3Size: number;
    normalSize: number;
    smallSize: number;
    bulletRadius: number;
    padding: number;
    cornerRadius: number;
  };
}

// Define the default theme as a fallback
const defaultPDFTheme: PDFTheme = {
  colors: {
    primary: [229, 113, 37],
    accent: [26, 188, 156],
    foreground: [23, 23, 23],
    mutedForeground: [100, 116, 139],
    background: [248, 250, 252],
    cardBg: [255, 255, 255],
    border: [226, 232, 240],
    gray: { bg: [241, 245, 249], border: [203, 213, 225] },
    yellow: { bg: [254, 249, 195], border: [253, 224, 71], title: [133, 77, 14] },
    sectionBlue: { bg: [239, 246, 255], border: [147, 197, 253], title: [29, 78, 216] },
    sectionGreen: { bg: [240, 253, 244], border: [134, 239, 172], title: [22, 101, 52] },
    sectionOrange: { bg: [255, 247, 237], border: [253, 186, 116], title: [194, 65, 12] },
  },
  styles: {
    fontFamily: "Helvetica",
    pageMargins: { top: 18, bottom: 18, left: 15, right: 15 },
    lineHeightFactor: 1.4,
    paragraphSpacing: 4,
    sectionSpacing: 8,
    titleSize: 22,
    subtitleSize: 11,
    h2Size: 16,
    h3Size: 12,
    normalSize: 10,
    smallSize: 8,
    bulletRadius: 1,
    padding: 8,
    cornerRadius: 3,
  },
};

// Create the context with a default value
const PDFThemeContext = createContext<PDFTheme>(defaultPDFTheme);

// Create a provider component
export const PDFThemeProvider = ({ children }: { children: ReactNode }) => {
  // In a real app, you might have logic here to load different themes.
  // For now, we provide the default theme.
  const theme = useMemo(() => defaultPDFTheme, []);
  return (
    <PDFThemeContext.Provider value={theme}>
      {children}
    </PDFThemeContext.Provider>
  );
};

// Create a custom hook for easy access to the theme, ensuring it's never null.
export const usePDFTheme = (): PDFTheme => {
  const context = useContext(PDFThemeContext);
  if (context === undefined) {
    // This should ideally not happen if the component is wrapped in the provider,
    // but it's a good safeguard.
    console.warn("usePDFTheme must be used within a PDFThemeProvider. Using default theme.");
    return defaultPDFTheme;
  }
  return context;
};
