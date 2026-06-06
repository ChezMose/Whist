import '../i18n';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { initDb } from '../storage/games';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  const { t } = useTranslation();

  useEffect(() => {
    initDb();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.textPrimary,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="game/[id]" options={{ title: t('screens.gameDetail') }} />
        <Stack.Screen
          name="player-select"
          options={{ title: t('screens.selectPlayer'), presentation: 'modal' }}
        />
      </Stack>
    </>
  );
}
