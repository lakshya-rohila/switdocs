import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { formatColors } from '../../theme/colors';
import { modalShadow } from '../../theme/shadows';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { GhostButton, FormatBadge, PrimaryButton } from './AppHeader';
import { useAppTheme } from '../../theme/ThemeProvider';

const FORMATS = Object.keys(formatColors) as (keyof typeof formatColors)[];

export function ExportFormatModal({
  visible,
  selected,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  selected: keyof typeof formatColors | null;
  onClose: () => void;
  onConfirm: (format: keyof typeof formatColors) => void;
}) {
  const { typography, colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const [draft, setDraft] = useState<keyof typeof formatColors>(
    selected ?? 'PDF',
  );

  React.useEffect(() => {
    if (visible && selected) {
      setDraft(selected);
    }
  }, [selected, visible]);

  return (
    <Modal transparent visible={visible}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheet,
            modalShadow as unknown as ViewStyle,
            { backgroundColor: colors.surface, width: Math.min(width - 32, 420) },
          ]}
        >
          <Text style={[typography.h3, { marginBottom: spacing.sm }]}>Export format</Text>
          <Text style={[typography.body, { marginBottom: spacing.md }]}>
            Choose how you’d like SwiftDocs to encode the output.
          </Text>
          <View style={styles.grid}>
            {FORMATS.map(fmt => (
              <Pressable
                key={fmt}
                accessibilityRole="button"
                onPress={() => setDraft(fmt)}
                style={{
                  flexBasis: '30%',
                  borderRadius: radius.md,
                  borderWidth: draft === fmt ? 2 : 1,
                  borderColor: draft === fmt ? colors.primary : colors.border,
                  paddingVertical: spacing.md,
                  alignItems: 'center',
                }}
              >
                <FormatBadge format={fmt} />
              </Pressable>
            ))}
          </View>
          <PrimaryButton
            label={`Use ${draft}`}
            onPress={() => {
              onConfirm(draft);
              onClose();
            }}
          />
          <GhostButton label="Dismiss" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.screenHorizontal,
  },
  sheet: {
    borderRadius: radius.lg + 8,
    padding: spacing.xl,
    gap: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
});
