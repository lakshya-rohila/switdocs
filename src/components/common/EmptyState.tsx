import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing } from '../../theme/spacing';
import { useAppTheme } from '../../theme/ThemeProvider';
import { GhostButton } from './AppHeader';

export function EmptyState({
  title,
  subtitle,
  actionLabel,
  onActionPress,
}: {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onActionPress?: () => void;
}) {
  const { typography, colors } = useAppTheme();
  return (
    <View style={styles.wrapper}>
      <View style={[styles.illustration, { borderColor: colors.primary, backgroundColor: colors.primaryLight }]}>
        <Text style={{ fontSize: 36 }}>📄</Text>
      </View>
      <Text style={[typography.h3, { textAlign: 'center', marginTop: spacing.lg }]}>
        {title}
      </Text>
      <Text style={[typography.body, { textAlign: 'center', marginTop: spacing.sm }]}>{subtitle}</Text>
      {actionLabel && onActionPress ? (
        <View style={{ marginTop: spacing.lg, width: '100%' }}>
          <GhostButton label={actionLabel} onPress={onActionPress} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenHorizontal + spacing.md,
    alignItems: 'center',
  },
  illustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
