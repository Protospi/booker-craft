// client/src/components/ui/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  enableSystem?: boolean;
  forcedTheme?: string;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = "system", 
  storageKey = "theme",
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}