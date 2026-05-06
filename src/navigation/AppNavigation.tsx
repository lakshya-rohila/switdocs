import {
  NavigationContainer,
  Theme as NavThemeType,
  DefaultTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';

import SplashScreen from '../screens/root/SplashScreen';
import OnboardingFlowScreen from '../screens/root/OnboardingFlowScreen';
import MainTabsNavigator from './MainTabsNavigator';
import { ROUTES } from './routes';
import type { RootStackParamList } from '../types/navigation';
import { useAppTheme } from '../theme/ThemeProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigatorWithTheme() {
  const { colors } = useAppTheme();

  const navigationTheme = useMemo<NavThemeType>(() => {
    const base = DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.accent,
      },
    };
  }, [colors]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.ROOT_SPLASH}>
        <Stack.Screen name={ROUTES.ROOT_SPLASH} component={SplashScreen} />
        <Stack.Screen name={ROUTES.ROOT_ONBOARDING} component={OnboardingFlowScreen} />
        <Stack.Screen name={ROUTES.ROOT_MAIN} component={MainTabsNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
