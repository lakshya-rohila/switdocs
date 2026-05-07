import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, type ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { cardShadow } from '../../theme/shadows';
import type { HomeStackParamList } from '../../types/navigation';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { useAppTheme } from '../../theme/ThemeProvider';

type Nav = NativeStackNavigationProp<HomeStackParamList>;

type ToolCardProps = {
  title: string;
  subtitle?: string;
  iconBackground: string;
  abbreviation: string;
  iconName?: string;
  iconImage?: string;
  route: keyof HomeStackParamList;
  navigation: Nav;
};

const TOOL_IMAGES: Record<string, ImageSourcePropType> = {
  'tool-create-pdf': require('../../../assets/images/tools/tool-create-pdf.jpg'),
  'tool-merge-pdf': require('../../../assets/images/tools/tool-merge-pdf.jpg'),
  'tool-split-pdf': require('../../../assets/images/tools/tool-split-pdf.jpg'),
  'tool-compress-pdf': require('../../../assets/images/tools/tool-compress-pdf.jpg'),
  'tool-signature': require('../../../assets/images/tools/tool-signature.jpg'),
  'tool-image-to-pdf': require('../../../assets/images/tools/tool-image-to-pdf.jpg'),
  'tool-convert-image': require('../../../assets/images/tools/tool-convert-image.jpg'),
  'tool-compress-image': require('../../../assets/images/tools/tool-compress-image.jpg'),
  'tool-resize-image': require('../../../assets/images/tools/tool-resize-image.jpg'),
  'tool-crop-image': require('../../../assets/images/tools/tool-crop-image.jpg'),
  'tool-qr-generator': require('../../../assets/images/tools/tool-qr-generator.jpg'),
  'tool-word-counter': require('../../../assets/images/tools/tool-word-counter.jpg'),
};

export function ToolCardGridItem({
  title,
  subtitle,
  iconBackground,
  abbreviation,
  iconName,
  iconImage,
  navigation,
  route,
}: Omit<ToolCardProps, 'onPress'>) {
  const { colors, typography } = useAppTheme();
  const imageSource = iconImage ? TOOL_IMAGES[iconImage] : undefined;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => navigation.navigate(route)}
      style={[
        styles.card,
        cardShadow,
        {
          backgroundColor: colors.surface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.iconStage, { backgroundColor: iconBackground }]}>
        {imageSource ? (
          <Image source={imageSource} style={styles.toolImage} resizeMode="contain" />
        ) : iconName ? (
          <Text style={[typography.button, { color: '#FFFFFF' }]} numberOfLines={1}>
            {abbreviation}
          </Text>
        ) : (
          <Text style={[typography.button, { color: '#FFFFFF' }]} numberOfLines={1}>
            {abbreviation}
          </Text>
        )}
      </View>
      <View style={styles.meta}>
        <Text style={[typography.label, { textAlign: 'center' }]} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[typography.caption, { textAlign: 'center' }]} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : (
          <Text style={[typography.caption, { color: colors.primary }]}> ›</Text>
        )}
      </View>
    </Pressable>
  );
}

export function ToolCardCompact({
  title,
  iconBackground,
  abbreviation,
  iconName,
  iconImage,
  navigation,
  route,
}: Pick<
  ToolCardProps,
  'title' | 'abbreviation' | 'iconBackground' | 'iconName' | 'iconImage' | 'navigation' | 'route'
>) {
  const { colors, typography } = useAppTheme();
  const imageSource = iconImage ? TOOL_IMAGES[iconImage] : undefined;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => navigation.navigate(route)}
      style={[
        styles.compactRow,
        { borderBottomColor: colors.border, backgroundColor: colors.surface },
      ]}
    >
      <View style={[styles.iconCompact, { backgroundColor: iconBackground }]}>
        {imageSource ? (
          <Image source={imageSource} style={styles.compactImage} resizeMode="contain" />
        ) : iconName ? (
          <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{abbreviation}</Text>
        ) : (
          <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{abbreviation}</Text>
        )}
      </View>
      <Text style={[typography.bodyLarge, { flex: 1 }]}>{title}</Text>
      <Text style={{ color: colors.textSecondary }}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    maxWidth: '48%',
    minHeight: 176,
    borderRadius: radius.lg + 8,
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  meta: {
    gap: spacing.xs,
    alignItems: 'center',
  },
  iconStage: {
    width: '100%',
    height: 96,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  toolImage: {
    width: '118%',
    height: '118%',
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.screenHorizontal,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
  },
  iconCompact: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  compactImage: {
    width: 56,
    height: 56,
  },
});
