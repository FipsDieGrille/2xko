import { AgentDefinition } from './types';
import { akali } from './akali';
import { caitlyn } from './caitlyn';

export const agents: AgentDefinition[] = [akali, caitlyn];

export function getAgent(id: string): AgentDefinition | undefined {
  return agents.find((a) => a.id === id);
}
