import { ComboEntry, ComboVariant } from './types';

/** Assemble full notation string from parts. */
export function getFullNotation(combo: ComboEntry, variant?: ComboVariant): string {
  const parts = [combo.starter, combo.combo];
  if (variant?.ending) {
    parts.push(variant.ending);
  }
  return parts.join(' > ');
}

/** Return the variant with the highest damage (used as default display). */
export function getBestVariant(combo: ComboEntry): ComboVariant | undefined {
  if (!combo.variants || combo.variants.length === 0) return undefined;
  return combo.variants.reduce((best, v) =>
    (v.damage ?? 0) > (best.damage ?? 0) ? v : best
  );
}

/** Get damage for display — from combo directly or its best variant. */
export function getComboDamage(combo: ComboEntry): number | null {
  if (combo.variants && combo.variants.length > 0) {
    return getBestVariant(combo)?.damage ?? null;
  }
  return combo.damage ?? null;
}

/** Get hits for display — from combo directly or its best variant. */
export function getComboHits(combo: ComboEntry): number | undefined {
  if (combo.variants && combo.variants.length > 0) {
    return getBestVariant(combo)?.hits;
  }
  return combo.hits;
}

/** Get meter for display — from combo directly or its best variant. */
export function getComboMeter(combo: ComboEntry): number {
  if (combo.variants && combo.variants.length > 0) {
    return getBestVariant(combo)?.meter ?? 0;
  }
  return combo.meter ?? 0;
}
