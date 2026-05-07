/**
 * SwiftDocs — Android-first toolkit shell built with React Navigation + Redux Toolkit.
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/common/Toast';

import type { RootState } from './src/store';
import RootNavigatorWithTheme from './src/navigation/AppNavigation';
import { store } from './src/store';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { AppModalProvider } from './src/components/common/AppModal';

function ThemedChrome() {
  const appearance = useSelector((state: RootState) => state.settings.appearance);

  return (
    <ThemeProvider themeModePreference={appearance}>
      <AppModalProvider>
        <StatusBar translucent backgroundColor="transparent" />
        <RootNavigatorWithTheme />
        <Toast config={toastConfig} />
      </AppModalProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#2563EB' }}>
        <SafeAreaProvider>
          <ThemedChrome />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
