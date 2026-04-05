import { useState, useCallback, useRef } from 'react';
import { sendMessage, MessageParam } from '../api/claude';
import { AgentDefinition } from '../agents/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: Date;
}

let nextId = 1;

export function useChatSession(agent: AgentDefinition) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hey! I'm your **${agent.character}** coach. Ask me about combos, frame data, matchups, team comps -- anything you need to level up your ${agent.character} game.`,
      createdAt: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const apiMessages = useRef<MessageParam[]>([]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsg: ChatMessage = {
        id: String(nextId++),
        role: 'user',
        text: text.trim(),
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      apiMessages.current = [
        ...apiMessages.current,
        { role: 'user' as const, content: text.trim() },
      ];

      setIsLoading(true);
      try {
        const reply = await sendMessage(apiMessages.current, agent.systemPrompt);

        apiMessages.current = [
          ...apiMessages.current,
          { role: 'assistant' as const, content: reply },
        ];

        const assistantMsg: ChatMessage = {
          id: String(nextId++),
          role: 'assistant',
          text: reply,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: any) {
        const errorMsg: ChatMessage = {
          id: String(nextId++),
          role: 'assistant',
          text: `Error: ${err.message}`,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [agent],
  );

  const clearChat = useCallback(() => {
    apiMessages.current = [];
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: 'Chat cleared. What would you like to work on?',
        createdAt: new Date(),
      },
    ]);
  }, []);

  return { messages, isLoading, send, clearChat };
}
