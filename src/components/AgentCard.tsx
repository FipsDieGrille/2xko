import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { AgentDefinition } from '../agents/types';
import { colors } from '../theme';

interface Props {
  agent: AgentDefinition;
  onChat: () => void;
  onCombos: () => void;
}

export function AgentCard({ agent, onChat, onCombos }: Props) {
  return (
    <View style={[styles.card, { borderColor: agent.color }]}>
      <View style={styles.top}>
        <Text style={styles.avatar}>{agent.avatar}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{agent.character}</Text>
          <Text style={styles.description}>{agent.description}</Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: agent.color }]}
          onPress={onChat}
          activeOpacity={0.7}
        >
          <Text style={styles.btnText}>💬  Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnOutline, { borderColor: agent.color }]}
          onPress={onCombos}
          activeOpacity={0.7}
        >
          <Text style={[styles.btnText, { color: agent.color }]}>📋  Combos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    fontSize: 36,
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  btnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
