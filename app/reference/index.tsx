import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { colors } from '../../src/theme';

const ITEMS = [
  { label: 'Frame Data', description: 'Startup, active, recovery for every move', soon: true },
  { label: 'Punish Finder', description: 'Best punish for any situation', soon: true },
];

export default function ReferenceScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Reference',
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);

  return (
    <View style={styles.container}>
      {ITEMS.map((item) => (
        <View key={item.label} style={[styles.card, item.soon && styles.cardDisabled]}>
          <View style={styles.cardInner}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          {item.soon && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Soon</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  cardDisabled: {
    opacity: 0.45,
  },
  cardInner: {
    flex: 1,
  },
  label: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  backBtn: {
    paddingLeft: 4,
    paddingRight: 12,
    paddingVertical: 6,
  },
  backText: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '600',
  },
});
