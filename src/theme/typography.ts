import { Platform } from 'react-native';
import type { ColorScheme } from './colors';

/** Use system UI font; optionally add `.ttf` under `assets/fonts`, link via `react-native.config.js`, then set `fontFamily` here (PostScript/name must match linked files). */
export const fontFamilyPrimary = Platform.select({
  ios: 'System',
  android: undefined,
  default: undefined,
});

export const createTypography = (colors: ColorScheme) => ({
  h1: { fontSize: 28, fontWeight: '700' as const, color: colors.textPrimary },
  h2: { fontSize: 22, fontWeight: '600' as const, color: colors.textPrimary },
  h3: { fontSize: 18, fontWeight: '600' as const, color: colors.textPrimary },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  button: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
