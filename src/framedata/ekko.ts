import { FrameDataEntry } from './types';

function n(v: string): number | null {
  if (!v || v === '#NA') return null;
  const parsed = parseFloat(v);
  return isNaN(parsed) ? null : parsed;
}

function s(v: string): string | null {
  if (!v || v === '#NA') return null;
  return v.trim();
}

export const ekkoFrameData: FrameDataEntry[] = [
  { move: 'L',        attackLevel: 'MID',  damage: 40,  comboHits: 1, startup: 6,   active: null, onHitMin: 0,   onHitMax: 0,   onBlockMin: -1,  onBlockMax: -1,  meterGain: 2  },
  { move: 'M',        attackLevel: 'MID',  damage: 55,  comboHits: 1, startup: 10,  active: null, onHitMin: -4,  onHitMax: -4,  onBlockMin: -5,  onBlockMax: -5,  meterGain: 3  },
  { move: 'H',        attackLevel: 'MID',  damage: 70,  comboHits: 1, startup: 13,  active: null, onHitMin: 1,   onHitMax: 1,   onBlockMin: -3,  onBlockMax: -3,  meterGain: 4  },
  { move: '2L',       attackLevel: 'LOW',  damage: 40,  comboHits: 1, startup: 7,   active: null, onHitMin: -1,  onHitMax: -1,  onBlockMin: -2,  onBlockMax: -2,  meterGain: 2  },
  { move: '2M',       attackLevel: 'LOW',  damage: 55,  comboHits: 1, startup: 10,  active: null, onHitMin: -4,  onHitMax: -4,  onBlockMin: -5,  onBlockMax: -5,  meterGain: 3  },
  { move: '2H',       attackLevel: 'LOW',  damage: 70,  comboHits: 1, startup: 13,  active: null, onHitMin: 21,  onHitMax: 21,  onBlockMin: -6,  onBlockMax: -6,  meterGain: 4  },
  { move: '3L',       attackLevel: 'LOW',  damage: 40,  comboHits: 1, startup: 9,   active: null, onHitMin: 1,   onHitMax: 1,   onBlockMin: -2,  onBlockMax: -2,  meterGain: 2  },
  { move: '3M',       attackLevel: 'HIGH', damage: 65,  comboHits: 1, startup: 22,  active: null, onHitMin: 5,   onHitMax: 5,   onBlockMin: -3,  onBlockMax: -3,  meterGain: 3  },
  { move: 'Run H',    attackLevel: 'MID',  damage: 93,  comboHits: 3, startup: 13,  active: null, onHitMin: 10,  onHitMax: 10,  onBlockMin: 1,   onBlockMax: 1,   meterGain: 9  },
  { move: '[H]',      attackLevel: 'MID',  damage: 90,  comboHits: 1, startup: 36,  active: null, onHitMin: 142, onHitMax: 142, onBlockMin: 5,   onBlockMax: 5,   meterGain: 7  },
  { move: '2[H]',     attackLevel: 'MID',  damage: 90,  comboHits: 1, startup: 33,  active: null, onHitMin: 33,  onHitMax: 33,  onBlockMin: -9,  onBlockMax: -9,  meterGain: 7  },
  { move: 'jL',       attackLevel: 'HIGH', damage: 40,  comboHits: 1, startup: 7,   active: null, onHitMin: 7,   onHitMax: 12,  onBlockMin: 6,   onBlockMax: 11,  meterGain: 2  },
  { move: 'jM',       attackLevel: 'HIGH', damage: 55,  comboHits: 1, startup: 9,   active: null, onHitMin: 11,  onHitMax: 16,  onBlockMin: 10,  onBlockMax: 14,  meterGain: 3  },
  { move: 'jH',       attackLevel: 'HIGH', damage: 70,  comboHits: 1, startup: 13,  active: null, onHitMin: 16,  onHitMax: 22,  onBlockMin: 16,  onBlockMax: 19,  meterGain: 4  },
  { move: 'j2H',      attackLevel: 'HIGH', damage: 65,  comboHits: 1, startup: 12,  active: null, onHitMin: 14,  onHitMax: 21,  onBlockMin: 11,  onBlockMax: 19,  meterGain: 4  },
  { move: 'j[H]',     attackLevel: 'HIGH', damage: 90,  comboHits: 1, startup: 30,  active: null, onHitMin: 23,  onHitMax: 29,  onBlockMin: 15,  onBlockMax: 17,  meterGain: 5  },
  { move: 'S1',       attackLevel: 'MID',  damage: 80,  comboHits: 1, startup: 15,  active: null, onHitMin: 4,   onHitMax: 19,  onBlockMin: -10, onBlockMax: -23, meterGain: 8  },
  { move: 'jS1',      attackLevel: 'MID',  damage: 80,  comboHits: 1, startup: 20,  active: null, onHitMin: 12,  onHitMax: 18,  onBlockMin: -5,  onBlockMax: -9,  meterGain: 7  },
  { move: '2S1',      attackLevel: 'MID',  damage: 80,  comboHits: 1, startup: 24,  active: null, onHitMin: 27,  onHitMax: 52,  onBlockMin: 0,   onBlockMax: 0,   meterGain: 8  },
  { move: '6S1',      attackLevel: 'MID',  damage: 163, comboHits: 3, startup: 19,  active: null, onHitMin: 53,  onHitMax: 53,  onBlockMin: -12, onBlockMax: -12, meterGain: 10 },
  { move: 'S2',       attackLevel: 'MID',  damage: 80,  comboHits: 1, startup: 19,  active: null, onHitMin: 3,   onHitMax: 3,   onBlockMin: -5,  onBlockMax: -5,  meterGain: 3  },
  { move: '[S2]',     attackLevel: 'MID',  damage: 90,  comboHits: 1, startup: 32,  active: null, onHitMin: 10,  onHitMax: 10,  onBlockMin: -1,  onBlockMax: -1,  meterGain: 6  },
  { move: 'S2, S2',   attackLevel: 'MID',  damage: 80,  comboHits: 1, startup: 22,  active: null, onHitMin: 42,  onHitMax: 42,  onBlockMin: -13, onBlockMax: -13, meterGain: 5  },
  { move: 'S2, 2S2',  attackLevel: 'MID',  damage: 60,  comboHits: 1, startup: 28,  active: null, onHitMin: 34,  onHitMax: 34,  onBlockMin: -1,  onBlockMax: -1,  meterGain: 4  },
  { move: '[S2], 2S2',attackLevel: 'MID',  damage: 95,  comboHits: 1, startup: 24,  active: null, onHitMin: 128, onHitMax: 128, onBlockMin: -5,  onBlockMax: -5,  meterGain: 8  },
  { move: '2S2',      attackLevel: null,   damage: null, comboHits: null, startup: 31, active: null, onHitMin: null, onHitMax: null, onBlockMin: null, onBlockMax: null, meterGain: null },
  { move: '2[S2]',    attackLevel: null,   damage: null, comboHits: null, startup: 45, active: null, onHitMin: null, onHitMax: null, onBlockMin: null, onBlockMax: null, meterGain: null },
  { move: 'S1+L',     attackLevel: 'MID',  damage: 201, comboHits: 1, startup: 61,  active: null, onHitMin: 59,  onHitMax: 59,  onBlockMin: -3,  onBlockMax: -9,  meterGain: 59 },
  { move: 'S2+M',     attackLevel: null,   damage: null, comboHits: null, startup: 61, active: null, onHitMin: null, onHitMax: null, onBlockMin: null, onBlockMax: null, meterGain: null },
  { move: 'S1+S2',    attackLevel: 'MID',  damage: 480, comboHits: 1, startup: 116, active: null, onHitMin: 32,  onHitMax: 32,  onBlockMin: -28, onBlockMax: -28, meterGain: 32 },
];
