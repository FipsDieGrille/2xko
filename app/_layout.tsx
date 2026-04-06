import { Stack } from 'expo-router';
import { Image } from 'react-native';
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
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => (
            <Image
              source={require('../assets/2xko-logo.png')}
              style={{ width: 330, height: 86, marginTop: 150 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Stack.Screen name="roster" options={{ headerShown: false }} />
      <Stack.Screen name="match-prep" options={{ headerShown: false }} />
      <Stack.Screen name="reference" options={{ headerShown: false }} />
      <Stack.Screen name="patch-notes" options={{ headerShown: false }} />
      <Stack.Screen name="combos" options={{ headerShown: false }} />
      <Stack.Screen name="framedata" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
    </Stack>
  );
}
