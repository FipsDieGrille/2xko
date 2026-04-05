import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { getAgent } from '../../src/agents';
import { useChatSession, ChatMessage } from '../../src/chat/useChatSession';
import { ComboNotation } from '../../src/components/ComboNotation';
import { isComboNotation } from '../../src/combo/parser';
import { colors } from '../../src/theme';

export default function ChatScreen() {
  const { agentId } = useLocalSearchParams<{ agentId: string }>();
  const agent = getAgent(agentId ?? '');
  const navigation = useNavigation();
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  if (!agent) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Agent not found</Text>
      </View>
    );
  }

  const { messages, isLoading, send, clearChat } = useChatSession(agent);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${agent.avatar} ${agent.character}`,
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
          <Text style={styles.clearText}>New</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, agent, clearChat, router]);

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    send(inputText);
    setInputText('');
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        {isUser ? (
          <Text style={styles.userText}>{item.text}</Text>
        ) : (
          renderAssistantMessage(item.text)
        )}
      </View>
    );
  };

  const renderAssistantMessage = (text: string) => {
    // Split on backtick-wrapped segments: `combo notation here`
    const parts = text.split(/(`[^`]+`)/g);

    return (
      <View>
        {parts.map((part, i) => {
          // Check if this is a backtick-wrapped segment
          if (part.startsWith('`') && part.endsWith('`')) {
            const inner = part.slice(1, -1);
            if (isComboNotation(inner)) {
              return <ComboNotation key={i} notation={inner} />;
            }
          }
          // Regular markdown text
          if (!part.trim()) return null;
          return <Markdown key={i} style={mdStyles}>{part}</Markdown>;
        })}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={[...messages].reverse()}
        keyExtractor={(m) => m.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.list}
        inverted
      />
      {isLoading && (
        <View style={styles.typing}>
          <ActivityIndicator size="small" color={agent.color} />
          <Text style={styles.typingText}>Coach is thinking...</Text>
        </View>
      )}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask your coach..."
          placeholderTextColor={colors.textSecondary}
          multiline
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: agent.color }]}
          onPress={handleSend}
          disabled={isLoading || !inputText.trim()}
        >
          <Text style={styles.sendText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const mdStyles = StyleSheet.create({
  body: { color: colors.text, fontSize: 15, lineHeight: 22 },
  heading1: { color: colors.text, fontSize: 20, fontWeight: '700' as const, marginVertical: 6 },
  heading2: { color: colors.text, fontSize: 17, fontWeight: '700' as const, marginVertical: 4 },
  heading3: { color: colors.text, fontSize: 15, fontWeight: '700' as const, marginVertical: 2 },
  strong: { color: colors.white, fontWeight: '700' as const },
  code_inline: {
    backgroundColor: colors.surfaceLight,
    color: '#e0a0ff',
    fontFamily: 'Courier',
    fontSize: 14,
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  fence: {
    backgroundColor: colors.surfaceLight,
    color: '#e0a0ff',
    fontFamily: 'Courier',
    fontSize: 13,
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
  },
  table: { borderColor: colors.border },
  th: { backgroundColor: colors.surfaceLight, padding: 6 },
  td: { padding: 6, borderColor: colors.border },
  tr: { borderColor: colors.border },
  link: { color: '#a78bfa' },
  blockquote: { backgroundColor: colors.surfaceLight, borderLeftColor: colors.accent, paddingLeft: 10 },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  error: {
    color: colors.text,
    fontSize: 16,
  },
  list: {
    padding: 12,
    paddingBottom: 4,
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.accent,
    maxWidth: '85%',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    maxWidth: '95%',
  },
  userText: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
  },
  typing: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  typingText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginLeft: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
});
