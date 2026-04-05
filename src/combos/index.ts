import { ComboEntry } from './types';
import { ahriCombos } from './ahri';
import { akaliCombos } from './akali';
import { blitzcrankCombos } from './blitzcrank';
import { braumCombos } from './braum';
import { caitlynCombos } from './caitlyn';
import { dariusCombos } from './darius';
import { ekkoCombos } from './ekko';
import { illaoiCombos } from './illaoi';
import { teemoCombos } from './teemo';
import { viCombos } from './vi';
import { warwickCombos } from './warwick';
import { yasuoCombos } from './yasuo';

const comboRegistry: Record<string, ComboEntry[]> = {
  ahri: ahriCombos,
  akali: akaliCombos,
  blitzcrank: blitzcrankCombos,
  braum: braumCombos,
  caitlyn: caitlynCombos,
  darius: dariusCombos,
  ekko: ekkoCombos,
  illaoi: illaoiCombos,
  teemo: teemoCombos,
  vi: viCombos,
  warwick: warwickCombos,
  yasuo: yasuoCombos,
};

export function getCombos(characterId: string): ComboEntry[] {
  return comboRegistry[characterId] ?? [];
}
