import { ANTHROPIC_API_KEY, DEFAULT_MODEL, MAX_TOKENS } from '../config';

export interface MessageParam {
  role: 'user' | 'assistant';
  content: string;
}

interface ApiResponse {
  content: Array<{ type: string; text: string }>;
  usage?: { input_tokens: number; output_tokens: number };
  error?: { type: string; message: string };
}

export async function sendMessage(
  messages: MessageParam[],
  systemPrompt: string,
  model: string = DEFAULT_MODEL,
): Promise<string> {
  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'your-api-key-here') {
    throw new Error('Set EXPO_PUBLIC_ANTHROPIC_API_KEY in .env');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_TOKENS,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages,
    }),
  });

  const data: ApiResponse = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  const textBlock = data.content.find((b) => b.type === 'text');
  return textBlock?.text ?? '';
}
