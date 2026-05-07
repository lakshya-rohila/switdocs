import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ROUTES } from '../../navigation/routes';
import type { RootStackParamList } from '../../types/navigation';
import { FONT } from '../../theme/typography';

export type SplashProps = NativeStackScreenProps<RootStackParamList, typeof ROUTES.ROOT_SPLASH>;

export default function SplashScreen({ navigation }: SplashProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace(ROUTES.ROOT_MAIN);
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim]);

  return (
    <View style={styles.hero}>
      <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
        <Text accessibilityRole="header" style={styles.wordmark}>
          Swift<Text style={styles.accent}>Docs</Text>
        </Text>
        <Text style={styles.tag}>Every doc tool. Zero ads. Always free.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  center: { alignItems: 'center' },
  wordmark: { color: '#FFFFFF', fontWeight: '700', fontSize: 36, fontFamily: FONT, letterSpacing: 0.5 },
  accent: { color: '#EFF6FF' },
  tag: { color: '#FFFFFF', opacity: 0.88, marginTop: 14, fontSize: 15, textAlign: 'center', fontFamily: FONT },
});
