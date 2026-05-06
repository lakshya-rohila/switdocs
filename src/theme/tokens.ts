import { rs, rf, rv } from '../utils/responsive';

export const Colors = {
  primary: '#2563EB',
  primaryLight: '#EFF6FF',
  primaryDark: '#1E40AF',
  accent: '#7C3AED',
  accentLight: '#F5F3FF',
  success: '#16A34A',
  successLight: '#F0FDF4',
  warning: '#D97706',
  warningLight: '#FFFBEB',
  error: '#DC2626',
  errorLight: '#FEF2F2',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textDisabled: '#CBD5E1',
  textInverse: '#FFFFFF',
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    border: '#334155',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
  },
  // Tool card icon background colors
  toolColors: {
    pdf: { bg: '#FEE2E2', icon: '#DC2626' },
    sign: { bg: '#E0E7FF', icon: '#4F46E5' },
    convert: { bg: '#D1FAE5', icon: '#059669' },
    image: { bg: '#FEF3C7', icon: '#D97706' },
    qr: { bg: '#F3E8FF', icon: '#7C3AED' },
    lock: { bg: '#FFE4E6', icon: '#E11D48' },
    merge: { bg: '#DBEAFE', icon: '#2563EB' },
    compress: { bg: '#DCFCE7', icon: '#16A34A' },
    split: { bg: '#FFF7ED', icon: '#EA580C' },
    watermark: { bg: '#F0F9FF', icon: '#0284C7' },
    text: { bg: '#FDF4FF', icon: '#A21CAF' },
    misc: { bg: '#F8FAFC', icon: '#475569' },
  },
  // Format badge colors
  formats: {
    PDF: { bg: '#FEE2E2', text: '#DC2626' },
    DOCX: { bg: '#DBEAFE', text: '#1D4ED8' },
    XLSX: { bg: '#D1FAE5', text: '#047857' },
    PPTX: { bg: '#FFEDD5', text: '#C2410C' },
    JPG: { bg: '#FEF3C7', text: '#B45309' },
    PNG: { bg: '#F3E8FF', text: '#6D28D9' },
    WebP: { bg: '#CCFBF1', text: '#0F766E' },
  },
};

export const Spacing = {
  xs: rs(4),
  sm: rs(8),
  md: rs(12),
  base: rs(16),
  lg: rs(20),
  xl: rs(24),
  xxl: rs(32),
  xxxl: rs(40),
  screen: rs(16), // consistent horizontal screen padding
};

export const Radius = {
  xs: rs(4),
  sm: rs(8),
  md: rs(12),
  lg: rs(16),
  xl: rs(20),
  xxl: rs(24),
  full: 999,
};

export const FontSize = {
  xs: rf(11),
  sm: rf(12),
  base: rf(14),
  md: rf(15),
  lg: rf(16),
  xl: rf(18),
  xxl: rf(22),
  xxxl: rf(28),
  display: rf(34),
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};
