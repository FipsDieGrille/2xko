import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

export default function MatchPrepLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.accent,
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        contentStyle: { backgroundColor: colors.background },
        headerBackTitle: 'Back',
      }}
    />
  );
}
