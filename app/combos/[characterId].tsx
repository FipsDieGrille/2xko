import React, { useState, useMemo, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { getCombos } from '../../src/combos';
import { ComboEntry } from '../../src/combos/types';
import { ComboNotation } from '../../src/components/ComboNotation';
import { colors } from '../../src/theme';

type MeterFilter = 'all' | '0' | '1' | '2+';
type AssistFilter = string;
type PositionFilter = 'all' | 'corner' | 'midscreen';
type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

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

  const [meterFilter, setMeterFilter] = useState<MeterFilter>('all');
  const [assistFilter, setAssistFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<PositionFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');

  const partnerOptions = useMemo(() => {
    const partners = Array.from(new Set(allCombos.map(c => c.partner).filter(Boolean))) as string[];
    return partners.sort();
  }, [allCombos]);

  // Collect unique starters for filter chips
  const starters = useMemo(() => {
    const s = Array.from(new Set(allCombos.map((c) => c.starter)));
    return ['all', ...s];
  }, [allCombos]);
  const [starterFilter, setStarterFilter] = useState<string>('all');

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
      return true;
    });
  }, [allCombos, meterFilter, assistFilter, positionFilter, difficultyFilter, starterFilter]);

  const accentColor = colors.accent;

  return (
    <View style={styles.container}>
      {/* Filter bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterBarContent}
      >
        <FilterGroup label="Meter">
          {(['all', '0', '1', '2+'] as MeterFilter[]).map((v) => (
            <Chip
              key={v}
              label={v === 'all' ? 'Any bars' : v === '0' ? '0 bars' : v === '1' ? '1 bar' : '2+ bars'}
              active={meterFilter === v}
              color={accentColor}
              onPress={() => setMeterFilter(v)}
            />
          ))}
        </FilterGroup>

        <Divider />

        <FilterGroup label="Assist">
          <Chip label="Any" active={assistFilter === 'all'} color={accentColor} onPress={() => setAssistFilter('all')} />
          <Chip label="Solo" active={assistFilter === 'solo'} color={accentColor} onPress={() => setAssistFilter('solo')} />
          {partnerOptions.map(p => (
            <Chip key={p} label={p} active={assistFilter === p} color={accentColor} onPress={() => setAssistFilter(p)} />
          ))}
        </FilterGroup>

        <Divider />

        <FilterGroup label="Position">
          {(['all', 'corner', 'midscreen'] as PositionFilter[]).map((v) => (
            <Chip
              key={v}
              label={v === 'all' ? 'Any' : v.charAt(0).toUpperCase() + v.slice(1)}
              active={positionFilter === v}
              color={accentColor}
              onPress={() => setPositionFilter(v)}
            />
          ))}
        </FilterGroup>

        <Divider />

        <FilterGroup label="Difficulty">
          {(['all', 'beginner', 'intermediate', 'advanced'] as DifficultyFilter[]).map((v) => (
            <Chip
              key={v}
              label={v === 'all' ? 'Any' : DIFFICULTY_LABEL[v]}
              active={difficultyFilter === v}
              color={accentColor}
              onPress={() => setDifficultyFilter(v)}
            />
          ))}
        </FilterGroup>

        <Divider />

        <FilterGroup label="Starter">
          {starters.map((v) => (
            <Chip
              key={v}
              label={v === 'all' ? 'Any' : v}
              active={starterFilter === v}
              color={accentColor}
              onPress={() => setStarterFilter(v)}
            />
          ))}
        </FilterGroup>
      </ScrollView>

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

function ComboCard({ combo }: { combo: ComboEntry }) {
  const dmg = combo.damage == null
    ? '?'
    : combo.damageMax
    ? `${combo.damage}–${combo.damageMax}`
    : `${combo.damage}`;

  const meterLabel = combo.meter === 0 ? '0 bars' : combo.meter === 1 ? '1 bar' : `${combo.meter} bars`;
  const posLabel = combo.position === 'anywhere' ? 'Anywhere' : combo.position.charAt(0).toUpperCase() + combo.position.slice(1);
  const diffColor = combo.difficulty ? DIFFICULTY_COLOR[combo.difficulty] : '#444466';

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

      <ComboNotation notation={combo.notation} />

      <View style={styles.badges}>
        <Badge icon="💥" label={`${dmg} dmg`} />
        <Badge icon="⚡" label={meterLabel} />
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

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.filterGroup}>
      <Text style={styles.filterLabel}>{label}</Text>
      <View style={styles.filterChips}>{children}</View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function Chip({
  label,
  active,
  color,
  onPress,
}: {
  label: string;
  active: boolean;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && { backgroundColor: color, borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterBar: {
    maxHeight: 90,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  filterGroup: {
    flexDirection: 'column',
    gap: 4,
  },
  filterLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 4,
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
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
