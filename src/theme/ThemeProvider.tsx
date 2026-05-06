import { palette } from './colors';
import type { ThemeMode } from '../store/slices/settingsSlice';
import { createTypography } from './typography';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo } from 'react';

export type ResolvedThemeColors = typeof palette;

type ThemeContextValue = {
  mode: 'light';
  themeModePreference: ThemeMode;
  colors: ResolvedThemeColors;
  typography: ReturnType<typeof createTypography>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  themeModePreference,
  children,
}: {
  themeModePreference: ThemeMode;
  children: ReactNode;
}) {
  const value = useMemo<ThemeContextValue>(() => ({
    mode: 'light',
    themeModePreference,
    colors: palette,
    typography: createTypography(palette),
  }), [themeModePreference]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
}
