import { FrameDataEntry } from './types';
import { ekkoFrameData } from './ekko';

export type { FrameDataEntry };

const registry: Record<string, FrameDataEntry[]> = {
  ekko: ekkoFrameData,
};

export function getFrameData(characterId: string): FrameDataEntry[] {
  return registry[characterId] ?? [];
}
