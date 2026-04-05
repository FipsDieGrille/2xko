import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { colors } from '../../src/theme';

export default function PatchNotesScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Patch Notes',
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Patch notes coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: colors.textSecondary,
    fontSize: 16,
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
