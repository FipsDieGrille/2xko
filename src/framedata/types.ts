export interface FrameDataEntry {
  move: string;
  attackLevel: string | null;
  damage: number | null;
  comboHits: number | null;
  startup: number | null;
  active: string | null;
  onHitMin: number | null;
  onHitMax: number | null;
  onBlockMin: number | null;
  onBlockMax: number | null;
  meterGain: number | null;
}
