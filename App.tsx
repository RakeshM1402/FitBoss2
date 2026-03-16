/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { useOfflineSync } from './src/hooks/useOfflineSync';

// Wrapper component to initialize global hooks that shouldn't re-mount on navigation
function AppContainer() {
  // Initialize offline sync loop
  useOfflineSync();
  
  return <AppNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContainer />
    </SafeAreaProvider>
  );
}
