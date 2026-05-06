import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import HomeStackNavigator from './HomeStack';
import RecentStackNavigator from './RecentStackNavigator';
import ScannerStackNavigator from './ScannerStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';
import { ROUTES } from './routes';
import type { MainTabParamList } from '../types/navigation';
import { useAppTheme } from '../theme/ThemeProvider';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabsNavigator() {
  const { colors, typography } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          paddingTop: 6,
          backgroundColor: colors.surface,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          minHeight: 58,
        },
        tabBarLabelStyle: {
          ...typography.caption,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name={ROUTES.TAB_HOME}
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Text style={[styles.glyph, { color, opacity: focused ? 1 : 0.85 }]}>⌂</Text>
          ),
          title: 'Home',
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_RECENT}
        component={RecentStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Text style={[styles.glyph, { color, opacity: focused ? 1 : 0.85 }]}>⏲</Text>
          ),
          title: 'Recent',
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_SCANNER}
        component={ScannerStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Text style={[styles.glyph, { color, opacity: focused ? 1 : 0.85 }]}>▣</Text>
          ),
          title: 'Scanner',
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_SETTINGS}
        component={SettingsStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Text style={[styles.glyph, { color, opacity: focused ? 1 : 0.85 }]}>⚙</Text>
          ),
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  glyph: { fontSize: 20, fontWeight: '600' },
});
