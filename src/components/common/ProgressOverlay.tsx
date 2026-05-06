import React from 'react';
import { Modal, StyleSheet, Text, View, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import { cardShadow } from '../../theme/shadows';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { useAppTheme } from '../../theme/ThemeProvider';

export function ProgressOverlay({
  visible,
  message,
}: {
  visible: boolean;
  message?: string;
}) {
  const { typography, colors } = useAppTheme();
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            cardShadow as unknown as ViewStyle,
            {
              backgroundColor: colors.surface,
            },
          ]}
        >
          <LottieView
            source={require('../../../assets/animations/loading.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text
            style={[
              typography.bodyLarge,
              { marginTop: spacing.md, color: colors.textPrimary, textAlign: 'center' },
            ]}
          >
            {message ?? 'Working…'}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(15,23,42,0.45)',
  },
  card: {
    borderRadius: radius.lg + 8,
    padding: spacing.xl,
    alignItems: 'center',
    width: '92%',
    maxWidth: 360,
  },
  lottie: {
    width: 100,
    height: 100,
  },
});
