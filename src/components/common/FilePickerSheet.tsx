import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GhostButton } from './AppHeader';
import { Icon } from './Icon';
import { modalShadow } from '../../theme/shadows';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { useAppTheme } from '../../theme/ThemeProvider';

export type FilePickerChoice = 'files' | 'photos' | 'drive' | 'dropbox';

export function FilePickerSheet({
  visible,
  onClose,
  onBrowse,
}: {
  visible: boolean;
  onClose: () => void;
  onBrowse?: (choice: FilePickerChoice) => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useAppTheme();

  function row(iconName: string, label: string, choice: FilePickerChoice, tint: string) {
    return (
      <Pressable
        accessibilityRole="button"
        key={choice}
        onPress={() => {
          onBrowse?.(choice);
          onClose();
        }}
        style={[styles.option, { borderColor: colors.border, backgroundColor: colors.surface }]}
      >
        <Icon name={iconName} size={22} color={tint} />
        <Text style={[typography.label, { flex: 1 }]}>{label}</Text>
        <Icon name="chevron-right" size={16} color={colors.textSecondary} />
      </Pressable>
    );
  }

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.container}>
        <Pressable accessibilityRole="button" style={styles.overlay} onPress={onClose} />
        <View
          pointerEvents="box-none"
          style={[
            styles.sheet,
            modalShadow as unknown as ViewStyle,
            {
              backgroundColor: colors.surface,
              paddingBottom: spacing.lg + insets.bottom,
            },
          ]}
        >
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />
          <Text style={[typography.h3, { marginBottom: spacing.lg }]}>Select File</Text>
          {row('folder', 'Browse Files', 'files', colors.primary)}
          {row('image', 'Choose from Photos', 'photos', colors.accent)}
          {row('cloud', 'Google Drive', 'drive', colors.success)}
          {row('archive', 'Dropbox', 'dropbox', colors.warning)}
          <View style={{ marginTop: spacing.md }}>
            <GhostButton label="Cancel" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,23,42,0.45)',
  },
  sheet: {
    borderTopLeftRadius: radius.lg + 12,
    borderTopRightRadius: radius.lg + 12,
    paddingHorizontal: spacing.screenHorizontal + spacing.xxs,
    paddingTop: spacing.lg,
    gap: spacing.sm,
    maxHeight: '65%',
  },
  grabber: {
    width: 52,
    height: 6,
    borderRadius: radius.pill,
    alignSelf: 'center',
    marginBottom: spacing.md,
    opacity: 0.85,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    gap: spacing.md,
    minHeight: 56,
  },
});
