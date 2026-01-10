import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { LogBox } from 'react-native';

import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import TasbeehScreen from './src/screens/TasbeehScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DhikrViewerScreen from './src/screens/DhikrViewerScreen';

// Components
import TimedOverlay from './src/components/TimedOverlay';
import SplashScreen from './src/components/SplashScreen';
import { DhikrProvider } from './src/context/DhikrContext';
import { getRandomVerse } from './src/utils/quranUtils'; // Import util

// Suppress known Expo Go SDK 53 warnings since we only use local notifications
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported',
]);

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [showOverlay, setShowOverlay] = useState(false); // Disabled
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [initialVerse, setInitialVerse] = useState(null); // Store verse at App level

  // Fetch verse once on App mount
  useEffect(() => {
    try {
      const v = getRandomVerse();
      setInitialVerse(v);
    } catch (e) {
      console.error("App Verse Fetch Error", e);
    }
  }, []);

  // Theme Colors
  const theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#10B981', // Emerald 500
      background: '#0F172A', // Slate 900
      card: '#1E293B', // Slate 800
      text: '#F8FAFC', // Slate 50
      border: '#334155',
    },
  };

  if (isSplashVisible) {
    return (
      <SplashScreen
        onFinish={() => setSplashVisible(false)}
        verseData={initialVerse} // Pass data down
      />
    );
  }

  return (
    <DhikrProvider>
      <NavigationContainer theme={theme}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center', // Center title for Arabic
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'المسبحة الإلكترونية', headerShown: false }} />
          <Stack.Screen name="Tasbeeh" component={TasbeehScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'الإعدادات' }} />
          <Stack.Screen name="DhikrViewer" component={DhikrViewerScreen} options={{ title: 'أذكار الصباح والمساء' }} />
        </Stack.Navigator>

        {/* Timed Overlay for Quranic Verse on App Launch */}
        {showOverlay && <TimedOverlay onDismiss={() => setShowOverlay(false)} />}
      </NavigationContainer>
    </DhikrProvider>
  );
}
