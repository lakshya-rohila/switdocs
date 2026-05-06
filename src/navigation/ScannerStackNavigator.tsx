import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import QRScannerScreen from '../screens/qr/QRScannerScreen';
import { ROUTES } from './routes';
import type { ScannerStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<ScannerStackParamList>();

export default function ScannerStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.QR_SCANNER} component={QRScannerScreen} />
    </Stack.Navigator>
  );
}
