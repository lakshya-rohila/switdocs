import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import SettingsScreen from '../screens/settings/SettingsScreen';
import { ROUTES } from './routes';
import type { SettingsStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
    </Stack.Navigator>
  );
}
