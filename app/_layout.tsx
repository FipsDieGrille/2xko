import { Stack } from 'expo-router';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.accent,
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: '2XKO' }} />
      <Stack.Screen name="roster" options={{ headerShown: false }} />
      <Stack.Screen name="match-prep" options={{ headerShown: false }} />
      <Stack.Screen name="reference" options={{ headerShown: false }} />
      <Stack.Screen name="patch-notes" options={{ headerShown: false }} />
      <Stack.Screen name="combos" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
    </Stack>
  );
}
