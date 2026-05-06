import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import RecentFilesScreen from '../screens/files/RecentFilesScreen';
import { ROUTES } from './routes';
import type { RecentStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RecentStackParamList>();

export default function RecentStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.RECENT_FILES} component={RecentFilesScreen} />
    </Stack.Navigator>
  );
}
