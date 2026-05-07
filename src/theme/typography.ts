import { Platform } from 'react-native';
import type { ColorScheme } from './colors';

/**
 * PTF NORDIC Rnd font family.
 *
 * Platform difference:
 *   iOS    → PostScript name:  PTF-NORDIC-Round
 *   Android → filename stem:   PTF-NORDIC-Rnd
 *
 * Linked via react-native-asset from assets/fonts/PTF-NORDIC-Rnd.ttf
 */
export const FONT = Platform.select({
  ios: 'PTF-NORDIC-Round',
  android: 'PTF-NORDIC-Rnd',
  default: 'PTF-NORDIC-Rnd',
}) as string;

export const createTypography = (colors: ColorScheme) => ({
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    fontFamily: FONT,
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600' as const,
    fontFamily: FONT,
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    fontFamily: FONT,
    color: colors.textPrimary,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: FONT,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: FONT,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: FONT,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    fontFamily: FONT,
    color: colors.textPrimary,
  },
  button: {
    fontSize: 15,
    fontWeight: '600' as const,
    fontFamily: FONT,
  },
});
