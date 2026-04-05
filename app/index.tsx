import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../src/theme';

const MENU = [
  {
    route: '/roster',
    label: 'Roster',
    description: 'Characters & combos',
  },
  {
    route: '/match-prep',
    label: 'Match Prep',
    description: 'Matchups · Teams · Okizeme',
  },
  {
    route: '/reference',
    label: 'Reference',
    description: 'Frame data · Punish finder',
  },
  {
    route: '/patch-notes',
    label: 'Patch Notes',
    description: 'Latest updates',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {MENU.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={styles.card}
          onPress={() => router.push(item.route as any)}
          activeOpacity={0.75}
        >
          <View style={styles.accent} />
          <View style={styles.cardContent}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: colors.accent,
  },
  cardContent: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  label: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },
  arrow: {
    color: colors.textSecondary,
    fontSize: 24,
    paddingRight: 16,
  },
});
