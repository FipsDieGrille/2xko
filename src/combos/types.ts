export interface ComboEntry {
  id: string;
  name: string;
  notation: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  position: 'anywhere' | 'corner' | 'midscreen';
  damage: number | null;
  damageMax?: number;
  meter: number;         // bars required
  meterGain?: number;    // meter built during combo
  starter: string;       // first input for filtering (e.g. '5L', '2M', 'jM')
  hasAssist: boolean;    // uses T (tag/assist call)
  partner?: string;      // tag combo partner character
  fuse?: string;         // required fuse (e.g. 'Double Down')
  notes?: string;
}
