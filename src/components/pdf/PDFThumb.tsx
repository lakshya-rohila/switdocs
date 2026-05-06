import React from 'react';
import { ScrollView as RNScroll, StyleSheet, Text, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useAppTheme } from '../../theme/ThemeProvider';

export function PDFPageThumbnailPlaceholder({ title }: { title: string }) {
  return (
    <View style={styles.sheet}>
      <View style={[styles.sheetInner, styles.accentStripe]} />
      <Text style={{ fontSize: 10, marginTop: spacing.xxs, color: '#64748B' }} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

export function PDFViewerPlaceholder() {
  const { colors, typography } = useAppTheme();
  return (
    <View
      accessible
      accessibilityLabel="PDF preview placeholder"
      style={[
        styles.blank,
        { backgroundColor: colors.primaryLight, borderColor: colors.border },
      ]}>
      <Text style={[typography.caption, { color: colors.textSecondary, alignSelf: 'center' }]}>
        Generate a preview to hydrate `react-native-pdf`.
      </Text>
    </View>
  );
}

/** Bounded preview wired to react-native-pdf (Android uses file:// URIs without cleartext). */
export function LocalPdfFlipbook({ uri, height = 440 }: { uri: string | null; height?: number }) {
  const normalized = uri
    ? uri.startsWith('file://')
      ? uri
      : `file://${uri}`
    : null;
  const { colors, typography } = useAppTheme();

  if (!normalized) {
    return <PDFViewerPlaceholder />;
  }

  return (
    <RNScroll nestedScrollEnabled>
      <View style={[styles.pdfShell, { height, borderColor: colors.border }]}>
        <Pdf
          enablePaging={false}
          trustAllCerts={false}
          source={{ uri: normalized, cache: true }}
          onLoadComplete={() => undefined}
          onError={() => undefined}
          style={styles.pdf}
        />
      </View>
      <Text style={[typography.caption, { marginTop: spacing.xs }]}>
        Pan & pinch via native PDF viewer.
      </Text>
    </RNScroll>
  );
}

const styles = StyleSheet.create({
  sheet: {
    width: 84,
    height: 110,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
    paddingHorizontal: spacing.xxs + 2,
    paddingTop: spacing.xxs + 2,
  },
  sheetInner: { flex: 1, borderRadius: 8, overflow: 'hidden' },
  accentStripe: { backgroundColor: '#EFF6FF' },
  blank: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  pdfShell: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
