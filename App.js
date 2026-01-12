import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { LogBox } from 'react-native';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { useTranslation } from 'react-i18next';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import TasbeehScreen from './src/screens/TasbeehScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DhikrViewerScreen from './src/screens/DhikrViewerScreen';
import AboutScreen from './src/screens/AboutScreen';

// Components
import TimedOverlay from './src/components/TimedOverlay';
import SplashScreen from './src/components/SplashScreen';
import { DhikrProvider } from './src/context/DhikrContext';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { getRandomVerse } from './src/utils/quranUtils'; 
import './src/i18n';

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

function MainNavigator({ initialVerse }) {
  const { theme, isLoaded, language } = useSettings();
  const { t } = useTranslation();
  const [showOverlay, setShowOverlay] = useState(false);
  const [isSplashVisible, setSplashVisible] = useState(true);

  if (!isLoaded || isSplashVisible) {
    return (
      <SplashScreen
        onFinish={() => setSplashVisible(false)}
        verseData={initialVerse}
      />
    );
  }

  const baseTheme = theme.dark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.danger,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: t('appName'), headerShown: false }} 
        />
        <Stack.Screen 
            name="Tasbeeh" 
            component={TasbeehScreen} 
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: t('settings') }} 
        />
        <Stack.Screen 
            name="DhikrViewer" 
            component={DhikrViewerScreen} 
            options={{ title: t('morningAzkar') }} // Will need dynamic title in screen usually, but generic defaults ok
        />
        <Stack.Screen 
            name="About" 
            component={AboutScreen} 
            options={{ title: t('about') }} 
        />
      </Stack.Navigator>

      {showOverlay && <TimedOverlay onDismiss={() => setShowOverlay(false)} />}
    </NavigationContainer>
  );
}

export default function App() {
  const [initialVerse, setInitialVerse] = useState(null);

  useEffect(() => {
    try {
      const v = getRandomVerse();
      setInitialVerse(v);
    } catch (e) {
      console.error("App Verse Fetch Error", e);
    }
  }, []);

  return (
    <SettingsProvider>
      <DhikrProvider>
         <MainNavigator initialVerse={initialVerse} />
      </DhikrProvider>
    </SettingsProvider>
  );
}
