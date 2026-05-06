import type { NavigationProp } from '@react-navigation/native';
import type { GestureResponderEvent, ViewStyle } from 'react-native';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { formatColors } from '../../theme/colors';
import { useAppTheme } from '../../theme/ThemeProvider';

type AppHeaderVariant = 'main' | 'inner';

type AppHeaderProps = {
  variant?: AppHeaderVariant;
  title?: string;
  navigation?: NavigationProp<Record<string, object | undefined>>;
  right?: React.ReactNode;
  onPressSearch?: () => void;
  onPressProfile?: () => void;
};

export function AppHeader({
  variant = 'main',
  title,
  navigation,
  right,
  onPressSearch,
  onPressProfile,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useAppTheme();
  const isMain = variant === 'main';

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + spacing.xs,
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}>
      <View style={styles.rowBetween}>
        {isMain ? (
          <>
            <View>
              <Text style={[styles.brandWord, typography.h3, { color: colors.textPrimary }]}>
                Swift<Text style={{ color: colors.primary }}>Docs</Text>
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                Every doc tool. Zero ads. Always free.
              </Text>
            </View>
            <View style={styles.actions}>
              <IconCircle
                label="⌕"
                onPress={() => onPressSearch?.()}
                accessibilityLabel="Search tools"
              />
              <IconCircle
                accent
                label="S"
                onPress={() => onPressProfile?.()}
                accessibilityLabel="Guest profile"
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.leftTitleRow}>
              <Pressable
                hitSlop={12}
                accessibilityRole="button"
                onPress={() => navigation?.canGoBack() && navigation.goBack()}
              >
                <Text style={[styles.back, { color: colors.primary }]}>‹</Text>
              </Pressable>
              <Text
                numberOfLines={1}
                style={[typography.h3, { color: colors.textPrimary, flex: 1 }]}>
                {title}
              </Text>
            </View>
            {right ?? <View style={{ width: 24 }} />}
          </>
        )}
      </View>
      {variant === 'inner' && (
        <TextInput style={styles.hiddenSearch} editable={false} />
      )}
    </View>
  );
}

export function InlineSearchBar({
  onPress,
  placeholder = 'Search tools…',
}: {
  onPress: () => void;
  placeholder?: string;
}) {
  const { colors, typography } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.searchOuter, { backgroundColor: colors.primaryLight }]}
    >
      <Text style={[typography.bodyLarge, { color: colors.textSecondary }]}>
        {placeholder}
      </Text>
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: (e?: GestureResponderEvent) => void;
  disabled?: boolean;
}) {
  const { typography, colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.primaryBtn,
        { backgroundColor: disabled ? colors.textDisabled : colors.primary },
      ]}
    >
      <Text style={[typography.button, { color: '#FFFFFF' }]}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  const { typography, colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.secondaryBtn, { borderColor: colors.primary }]}
    >
      <Text style={[typography.button, { color: colors.primary }]}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { typography, colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={{ opacity: disabled ? 0.45 : 1 }}>
      <Text style={[typography.button, { color: colors.primary, textAlign: 'center' }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function IconCircle({
  label,
  onPress,
  accent,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  accent?: boolean;
  accessibilityLabel?: string;
}) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[
        styles.circle,
        {
          borderColor: colors.border,
          backgroundColor: accent ? colors.primaryLight : colors.surface,
        },
      ]}
    >
      <Text style={{ fontSize: accent ? 14 : 18, fontWeight: accent ? '700' : '400', color: accent ? colors.primary : colors.textPrimary }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function UploadZone({ label, onPress }: { label: string; onPress?: () => void }) {
  const { typography, colors } = useAppTheme();
  const inner = (
    <View
      style={[
        styles.pickInner,
        { borderColor: colors.border, backgroundColor: colors.primaryLight },
      ]}>
      <Text style={[typography.h3, { textAlign: 'center', marginBottom: spacing.xs }]}>↗︎</Text>
      <Text style={[typography.body, { textAlign: 'center', color: colors.textPrimary }]}>{label}</Text>
    </View>
  );

  return onPress ? (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
      {inner}
    </Pressable>
  ) : (
    <View>{inner}</View>
  );
}

export function LabeledField(
  props: TextInputProps & { label?: string; error?: string },
): React.ReactElement {
  const { label, style, error, ...rest } = props;
  const { typography, colors } = useAppTheme();
  return (
    <View style={{ gap: spacing.xs }}>
      {label ? <Text style={[typography.label]}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.input,
          {
            borderColor: error ? colors.error : colors.border,
            color: colors.textPrimary,
          },
          style as ViewStyle | undefined,
        ]}
        {...rest}
      />
      {error ? (
        <Text style={[typography.caption, { color: colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

export function FormatBadge({ format }: { format: keyof typeof formatColors }) {
  return (
    <View style={[styles.badge, { backgroundColor: formatColors[format] }]}>
      <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>{format}</Text>
    </View>
  );
}

export function Segmented<T extends string>({
  items,
  value,
  onChange,
}: {
  items: readonly T[];
  value: T;
  onChange: (next: T) => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        styles.segment,
        { borderColor: colors.border, backgroundColor: colors.surface },
      ]}
    >
      {items.map(item => {
        const selected = item === value;
        return (
          <Pressable
            key={item}
            accessibilityRole="button"
            onPress={() => onChange(item)}
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              borderRadius: radius.md,
              alignItems: 'center',
              backgroundColor: selected ? colors.primaryLight : 'transparent',
            }}
          >
            <Text
              style={{
                fontWeight: selected ? '600' : '500',
                color: selected ? colors.primaryDark : colors.textSecondary,
                fontSize: 13,
              }}
            >
              {item}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.md,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  brandWord: { letterSpacing: 0.2 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  leftTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  back: { fontSize: 32, marginRight: spacing.xxs },
  circle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchOuter: {
    marginHorizontal: spacing.screenHorizontal,
    marginVertical: spacing.md,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  hiddenSearch: { opacity: 0, height: 0 },
  primaryBtn: {
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  secondaryBtn: {
    borderRadius: radius.xl,
    borderWidth: 2,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  pickInner: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: radius.lg,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
  },
  segment: {
    flexDirection: 'row',
    borderRadius: radius.md + 4,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    gap: spacing.xxs,
    padding: 4,
  },
});
