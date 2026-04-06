import React, { useState, useMemo, useLayoutEffect, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { getCombos } from '../../src/combos';
import { ComboEntry } from '../../src/combos/types';
import { ComboNotation } from '../../src/components/ComboNotation';
import { colors } from '../../src/theme';

type MeterFilter = 'all' | '0' | '1' | '2+';
type PositionFilter = 'all' | 'corner' | 'midscreen';
type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

type SavedFilters = {
  meter: MeterFilter;
  assist: string;
  position: PositionFilter;
  difficulty: DifficultyFilter;
  starter: string;
  fuse: string;
};

const savedFilters: Record<string, SavedFilters> = {};

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: 'BEG',
  intermediate: 'INT',
  advanced: 'ADV',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
};

function meterLabel(v: MeterFilter) {
  if (v === 'all') return 'Any';
  if (v === '0') return '0 bars';
  if (v === '1') return '1 bar';
  return '2+ bars';
}

function positionLabel(v: PositionFilter) {
  if (v === 'all') return 'Any';
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function difficultyLabel(v: DifficultyFilter) {
  if (v === 'all') return 'Any';
  return DIFFICULTY_LABEL[v];
}

export default function ComboListScreen() {
  const { characterId } = useLocalSearchParams<{ characterId: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const allCombos = getCombos(characterId ?? '');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: characterId
        ? characterId.charAt(0).toUpperCase() + characterId.slice(1)
        : 'Combos',
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [characterId, navigation, router]);

  const saved = savedFilters[characterId ?? ''];
  const [meterFilter, setMeterFilter] = useState<MeterFilter>(saved?.meter ?? 'all');
  const [assistFilter, setAssistFilter] = useState<string>(saved?.assist ?? 'all');
  const [positionFilter, setPositionFilter] = useState<PositionFilter>(saved?.position ?? 'all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>(saved?.difficulty ?? 'all');
  const [starterFilter, setStarterFilter] = useState<string>(saved?.starter ?? 'all');
  const [fuseFilter, setFuseFilter] = useState<string>(saved?.fuse ?? 'all');

  useEffect(() => {
    if (!characterId) return;
    savedFilters[characterId] = {
      meter: meterFilter,
      assist: assistFilter,
      position: positionFilter,
      difficulty: difficultyFilter,
      starter: starterFilter,
      fuse: fuseFilter,
    };
  }, [characterId, meterFilter, assistFilter, positionFilter, difficultyFilter, starterFilter, fuseFilter]);

  const partnerOptions = useMemo(() => {
    const partners = Array.from(new Set(allCombos.map(c => c.partner).filter(Boolean))) as string[];
    return partners.sort();
  }, [allCombos]);

  const starters = useMemo(() => {
    return Array.from(new Set(allCombos.map((c) => c.starter))).sort();
  }, [allCombos]);

  const fuseOptions = useMemo(() => {
    return Array.from(new Set(allCombos.map(c => c.fuse).filter(Boolean))) as string[];
  }, [allCombos]);

  const filtered = useMemo(() => {
    return allCombos.filter((c) => {
      if (meterFilter === '0' && c.meter !== 0) return false;
      if (meterFilter === '1' && c.meter !== 1) return false;
      if (meterFilter === '2+' && c.meter < 2) return false;
      if (assistFilter === 'solo' && c.hasAssist) return false;
      if (assistFilter !== 'all' && assistFilter !== 'solo' && c.partner !== assistFilter) return false;
      if (positionFilter !== 'all' && c.position !== positionFilter && c.position !== 'anywhere') return false;
      if (difficultyFilter !== 'all' && c.difficulty !== difficultyFilter) return false;
      if (starterFilter !== 'all' && c.starter !== starterFilter) return false;
      if (fuseFilter !== 'all' && c.fuse !== fuseFilter) return false;
      return true;
    });
  }, [allCombos, meterFilter, assistFilter, positionFilter, difficultyFilter, starterFilter, fuseFilter]);

  const assistLabel = assistFilter === 'all' ? 'Any' : assistFilter === 'solo' ? 'Solo' : assistFilter;

  return (
    <View style={styles.container}>
      {/* Filter dropdowns */}
      <View style={styles.filterBar}>
        <Dropdown
          label="Starter"
          value={starterFilter === 'all' ? 'Any' : starterFilter}
          active={starterFilter !== 'all'}
          options={[
            { label: 'Any', value: 'all' },
            ...starters.map(s => ({ label: s, value: s })),
          ]}
          onChange={setStarterFilter}
        />
        <Dropdown
          label="Difficulty"
          value={difficultyLabel(difficultyFilter)}
          active={difficultyFilter !== 'all'}
          options={[
            { label: 'Any', value: 'all' },
            { label: 'BEG', value: 'beginner' },
            { label: 'INT', value: 'intermediate' },
            { label: 'ADV', value: 'advanced' },
          ]}
          onChange={(v) => setDifficultyFilter(v as DifficultyFilter)}
        />
        <Dropdown
          label="Position"
          value={positionLabel(positionFilter)}
          active={positionFilter !== 'all'}
          options={[
            { label: 'Any', value: 'all' },
            { label: 'Corner', value: 'corner' },
            { label: 'Midscreen', value: 'midscreen' },
          ]}
          onChange={(v) => setPositionFilter(v as PositionFilter)}
        />
        <Dropdown
          label="Meter"
          value={meterLabel(meterFilter)}
          active={meterFilter !== 'all'}
          options={[
            { label: 'Any', value: 'all' },
            { label: '0 bars', value: '0' },
            { label: '1 bar', value: '1' },
            { label: '2+ bars', value: '2+' },
          ]}
          onChange={(v) => setMeterFilter(v as MeterFilter)}
        />
        <Dropdown
          label="Assist"
          value={assistLabel}
          active={assistFilter !== 'all'}
          options={[
            { label: 'Any', value: 'all' },
            { label: 'Solo', value: 'solo' },
            ...partnerOptions.map(p => ({ label: p, value: p })),
          ]}
          onChange={setAssistFilter}
        />
        <Dropdown
          label="Fuse"
          value={fuseFilter === 'all' ? 'Any' : fuseFilter}
          active={fuseFilter !== 'all'}
          options={[{ label: 'Any', value: 'all' }, ...fuseOptions.map(f => ({ label: f, value: f }))]}
          onChange={setFuseFilter}
        />
      </View>

      <Text style={styles.resultCount}>{filtered.length} combo{filtered.length !== 1 ? 's' : ''}</Text>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => <ComboCard combo={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No combos match these filters.</Text>
        }
      />
    </View>
  );
}

function Dropdown({
  label,
  value,
  active,
  options,
  onChange,
}: {
  label: string;
  value: string;
  active: boolean;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.dropdown, active && styles.dropdownActive]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.dropdownLabel, active && styles.dropdownLabelActive]}>
          {label}
        </Text>
        <Text style={[styles.dropdownValue, active && styles.dropdownValueActive]} numberOfLines={1}>
          {value} ▾
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.menu} onPress={() => {}}>
            <Text style={styles.menuTitle}>{label}</Text>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.menuItem, opt.label === value && styles.menuItemActive]}
                onPress={() => { onChange(opt.value); setOpen(false); }}
                activeOpacity={0.7}
              >
                <Text style={[styles.menuItemText, opt.label === value && styles.menuItemTextActive]}>
                  {opt.label}
                </Text>
                {opt.label === value && <Text style={styles.menuItemCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function ComboCard({ combo }: { combo: ComboEntry }) {
  const [expanded, setExpanded] = useState(false);
  const lastTap = useRef<number>(0);

  const dmg = combo.damage == null
    ? '?'
    : combo.damageMax
    ? `${combo.damage}–${combo.damageMax}`
    : `${combo.damage}`;

  const meterLbl = combo.meter === 0 ? '0 bars' : combo.meter === 1 ? '1 bar' : `${combo.meter} bars`;
  const posLabel = combo.position === 'anywhere' ? 'Anywhere' : combo.position.charAt(0).toUpperCase() + combo.position.slice(1);
  const diffColor = combo.difficulty ? DIFFICULTY_COLOR[combo.difficulty] : '#444466';

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setExpanded(v => !v);
    }
    lastTap.current = now;
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.comboName}>{combo.name}</Text>
        {combo.difficulty && (
          <View style={[styles.diffBadge, { borderColor: diffColor }]}>
            <Text style={[styles.diffText, { color: diffColor }]}>{DIFFICULTY_LABEL[combo.difficulty]}</Text>
          </View>
        )}
      </View>

      <View onTouchEnd={handleDoubleTap}>
        <ComboNotation notation={combo.notation} wrap={expanded} />
      </View>

      <View style={styles.badges}>
        <Badge icon="💥" label={`${dmg} dmg`} />
        <Badge icon="⚡" label={meterLbl} />
        {combo.position !== 'anywhere' && <Badge icon="📍" label={posLabel} />}
        {combo.hasAssist && <Badge icon="🤝" label={combo.partner ?? 'Assist'} />}
        {combo.fuse && <Badge icon="🔗" label={combo.fuse} />}
        {combo.meterGain != null && <Badge icon="📈" label={`+${combo.meterGain} meter`} />}
      </View>

      {combo.notes != null && (
        <Text style={styles.notes}>{combo.notes}</Text>
      )}
    </View>
  );
}

function Badge({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{icon} {label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Filter bar
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdown: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexBasis: '30%',
    flexGrow: 1,
    flexShrink: 1,
  },
  dropdownActive: {
    borderColor: colors.accent,
  },
  dropdownLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 1,
  },
  dropdownLabelActive: {
    color: colors.accent,
  },
  dropdownValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  dropdownValueActive: {
    color: colors.text,
  },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 8,
    minWidth: 200,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemActive: {
    backgroundColor: colors.surfaceLight,
  },
  menuItemText: {
    color: colors.text,
    fontSize: 15,
  },
  menuItemTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  menuItemCheck: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },

  // Results
  resultCount: {
    color: colors.textSecondary,
    fontSize: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  list: {
    padding: 12,
    paddingBottom: 32,
  },

  // Combo card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  comboName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  diffBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  diffText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  badge: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  notes: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
  },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
  backBtn: {
    paddingLeft: 4,
    paddingRight: 12,
    paddingVertical: 6,
  },
  backText: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '600',
  },
});
