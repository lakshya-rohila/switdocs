/**
 * ToolShell — ultra-simple layout wrapper for every tool screen.
 *
 * Structure:
 *   Header (back + title)
 *   ScrollView content area
 *   Optional sticky bottom action bar
 */
import React, { type PropsWithChildren, type ReactElement } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Icon } from './Icon';

// ─── ToolShell ────────────────────────────────────────────────────────────────

type ToolShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  navigation: NavigationProp<Record<string, object | undefined>>;
  /** Content for a sticky bottom action bar */
  bottomBar?: ReactElement;
}>;

export function ToolShell({ title, subtitle, navigation, bottomBar, children }: ToolShellProps) {
  const { colors, typography } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border, paddingTop: insets.top + spacing.xs }]}>
        <Pressable
          accessibilityRole="button"
          hitSlop={16}
          onPress={() => navigation.canGoBack() && navigation.goBack()}
          style={styles.backBtn}
        >
          <Icon name="chevron-left" size={26} color={colors.primary} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={[typography.h3, { color: colors.textPrimary }]} numberOfLines={1}>{title}</Text>
          {subtitle ? (
            <Text style={[typography.caption, { color: colors.textSecondary }]} numberOfLines={1}>{subtitle}</Text>
          ) : null}
        </View>
      </View>

      {/* Scrollable body */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.body, { paddingBottom: bottomBar ? 0 : spacing.xxxl + insets.bottom }]}
      >
        {children}
      </ScrollView>

      {/* Sticky bottom bar */}
      {bottomBar ? (
        <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom + spacing.sm }]}>
          {bottomBar}
        </View>
      ) : null}
    </View>
  );
}

// ─── PickerCard ───────────────────────────────────────────────────────────────
/** Tappable upload zone for picking a file */

type PickerCardProps = {
  label: string;
  hint?: string;
  onPress: () => void;
  fileName?: string;
  fileSize?: string;
  busy?: boolean;
};

export function PickerCard({ label, hint, onPress, fileName, fileSize, busy }: PickerCardProps) {
  const { colors, typography } = useAppTheme();

  if (fileName) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={[styles.pickerFilled, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
      >
        <Icon name="file-text" size={26} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={[typography.label, { color: colors.textPrimary }]} numberOfLines={1}>{fileName}</Text>
          {fileSize ? <Text style={[typography.caption, { color: colors.textSecondary }]}>{fileSize} · tap to change</Text> : <Text style={[typography.caption, { color: colors.textSecondary }]}>Tap to change</Text>}
        </View>
        <Icon name="check-circle" size={20} color={colors.primary} />
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={busy ? undefined : onPress}
      style={[styles.pickerEmpty, { borderColor: colors.border, backgroundColor: colors.surface }]}
    >
      {busy ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <>
          <Icon name="upload" size={32} color={colors.primary} />
          <Text style={[typography.bodyLarge, { color: colors.textPrimary, textAlign: 'center', fontWeight: '600' }]}>{label}</Text>
          {hint ? <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center' }]}>{hint}</Text> : null}
        </>
      )}
    </Pressable>
  );
}

// ─── InfoBox ──────────────────────────────────────────────────────────────────
/** A soft-colored info / notice box */

export function InfoBox({ icon, text }: { icon?: string; text: string }) {
  const { colors, typography } = useAppTheme();
  return (
    <View style={[styles.infoBox, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
      {icon ? <Icon name={icon} size={18} color={colors.primary} /> : null}
      <Text style={[typography.body, { color: colors.textSecondary, flex: 1 }]}>{text}</Text>
    </View>
  );
}

// ─── BigButton ────────────────────────────────────────────────────────────────
/** Full-width primary CTA button */

export function BigButton({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'ghost' | 'danger';
}) {
  const { colors, typography } = useAppTheme();
  const isDisabled = disabled || loading;

  const bg = variant === 'primary'
    ? isDisabled ? colors.textDisabled : colors.primary
    : 'transparent';

  const textColor = variant === 'primary'
    ? '#FFFFFF'
    : variant === 'danger'
    ? '#DC2626'
    : colors.primary;

  const border = variant !== 'primary' ? { borderWidth: variant === 'ghost' ? 0 : 0 } : {};

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={[styles.bigBtn, { backgroundColor: bg }, border]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : colors.primary} />
      ) : (
        <Text style={[typography.button, { color: textColor, textAlign: 'center' }]}>{label}</Text>
      )}
    </Pressable>
  );
}

// ─── OptionRow ────────────────────────────────────────────────────────────────
/** Selectable option row with label + optional description */

export function OptionRow({
  label,
  description,
  selected,
  onPress,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors, typography } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[
        styles.optionRow,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? colors.primaryLight : colors.surface,
        },
      ]}
    >
      <View style={[styles.optionDot, { borderColor: selected ? colors.primary : colors.border }]}>
        {selected ? <View style={[styles.optionDotFill, { backgroundColor: colors.primary }]} /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[typography.label, { color: colors.textPrimary }]}>{label}</Text>
        {description ? <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────

export function SectionLabel({ text }: { text: string }) {
  const { typography, colors } = useAppTheme();
  return (
    <Text style={[typography.caption, { color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: spacing.xs }]}>
      {text}
    </Text>
  );
}

// ─── ImagePreviewCard ─────────────────────────────────────────────────────────

export function ImagePreviewCard({ uri, onRemove }: { uri: string; onRemove?: () => void }) {
  const { colors } = useAppTheme();
  const src = uri.startsWith('file://') ? uri : `file://${uri}`;
  return (
    <View style={[styles.imgPreview, { borderColor: colors.border }]}>
      <Image source={{ uri: src }} style={styles.imgPreviewImg} resizeMode="cover" />
      {onRemove ? (
        <Pressable accessibilityRole="button" onPress={onRemove} style={[styles.imgRemove, { backgroundColor: colors.surface }]}>
          <Icon name="x" size={14} color={colors.textPrimary} />
        </Pressable>
      ) : null}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  backBtn: { padding: spacing.xxs },
  headerText: { flex: 1 },

  body: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },

  bottomBar: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },

  pickerEmpty: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  pickerFilled: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.md,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    padding: spacing.md,
  },

  bigBtn: {
    borderRadius: radius.xl,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  optionDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionDotFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  imgPreview: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  imgPreviewImg: { width: '100%', height: 200 },
  imgRemove: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
