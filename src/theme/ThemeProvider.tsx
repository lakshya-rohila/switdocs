import { darkPalette, palette } from './colors';
import type { ThemeMode } from '../store/slices/settingsSlice';
import { createTypography } from './typography';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

export type ResolvedThemeColors = typeof palette | typeof darkPalette;

type ThemeContextValue = {
  mode: 'light' | 'dark';
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
  const scheme = useColorScheme();
  const mode: 'light' | 'dark' =
    themeModePreference === 'system'
      ? scheme === 'dark'
        ? 'dark'
        : 'light'
      : themeModePreference;

  const value = useMemo<ThemeContextValue>(() => {
    const colors = mode === 'dark' ? darkPalette : palette;
    return {
      mode,
      themeModePreference,
      colors,
      typography: createTypography(colors as unknown as typeof palette),
    };
  }, [mode, themeModePreference]);

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
