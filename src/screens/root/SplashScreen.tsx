import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ROUTES } from '../../navigation/routes';
import type { RootStackParamList } from '../../types/navigation';
import { FONT } from '../../theme/typography';

export type SplashProps = NativeStackScreenProps<RootStackParamList, typeof ROUTES.ROOT_SPLASH>;

export default function SplashScreen({ navigation }: SplashProps) {
  useEffect(() => {
    let cancelled = false;
    // Always go straight to the main app — no onboarding gate
    const go = async () => {
      if (!cancelled) {
        navigation.replace(ROUTES.ROOT_MAIN);
      }
    };
    go();
    return () => { cancelled = true; };
  }, [navigation]);

  return (
    <View style={[styles.hero, styles.center]}>
      <Text accessibilityRole="header" style={styles.wordmark}>
        Swift<Text style={styles.accent}>Docs</Text>
      </Text>
      <Text style={styles.tag}>Every doc tool. Zero ads. Always free.</Text>
      <ActivityIndicator style={styles.spinner} color="#EFF6FF" />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingHorizontal: 28,
  },
  center: { justifyContent: 'center', alignItems: 'center' },
  wordmark: { color: '#FFFFFF', fontWeight: '700', fontSize: 36, fontFamily: FONT, letterSpacing: 0.5 },
  accent: { color: '#EFF6FF' },
  tag: { color: '#FFFFFF', opacity: 0.88, marginTop: 14, fontSize: 15, textAlign: 'center', fontFamily: FONT },
  spinner: { marginTop: 48 },
});
