export const palette = {
  primary: '#2563EB',
  primaryLight: '#EFF6FF',
  primaryDark: '#1E40AF',
  accent: '#7C3AED',
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textDisabled: '#CBD5E1',
} as const;

export const darkPalette = {
  primary: '#3B82F6',
  primaryLight: '#1E293B',
  primaryDark: '#60A5FA',
  accent: '#8B5CF6',
  success: '#22C55E',
  warning: '#FBBF24',
  error: '#F87171',
  background: '#0F172A',
  surface: '#1E293B',
  border: '#334155',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textDisabled: '#64748B',
} as const;

export const formatColors = {
  PDF: '#DC2626',
  DOCX: '#2563EB',
  XLSX: '#16A34A',
  PPTX: '#EA580C',
  JPG: '#D97706',
  PNG: '#7C3AED',
  WebP: '#0D9488',
  HTML: '#64748B',
} as const;

export type ColorScheme = typeof palette;
