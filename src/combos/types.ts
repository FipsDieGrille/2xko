export interface ComboVariant {
  name?: string;               // short label for the variant (e.g. 'super', 'basic')
  ending: string;              // notation for the ending portion
  damage: number | null;
  damageMax?: number;
  hits?: number;
  meter: number;
  meterGain?: number;
  notes?: string;
}

export interface ComboEntry {
  id: string;
  name: string;
  starter: string;             // starter sequence: 'L > L > 2L' or 'M'
  combo: string;               // shared body notation
  variants?: ComboVariant[];   // present when combo branches into different endings

  // Single-combo metadata (used when no variants)
  damage?: number | null;
  damageMax?: number;
  hits?: number;
  meter?: number;
  meterGain?: number;

  // Always at combo level
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  position: 'anywhere' | 'corner' | 'midscreen';
  hasAssist: boolean;
  partner?: string;
  fuse?: string;
  notes?: string;
}
