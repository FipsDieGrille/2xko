import { AgentDefinition } from './types';
import { caitlyn } from './caitlyn';

export const agents: AgentDefinition[] = [caitlyn];

export function getAgent(id: string): AgentDefinition | undefined {
  return agents.find((a) => a.id === id);
}
