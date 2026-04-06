import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { getFrameData, FrameDataEntry } from '../../src/framedata';
import { ComboNotation } from '../../src/components/ComboNotation';
import { colors } from '../../src/theme';

type SortKey = 'move' | 'attackLevel' | 'damage' | 'startup' | 'onHitMin' | 'onBlockMin' | 'meterGain';
type SortDir = 'asc' | 'desc';

const COL = {
  move: 124,
  level: 40,
  dmg: 40,
  startup: 40,
  onHit: 40,
  onBlock: 40,
  meter: 40,
};

const LEGEND = [
  { key: 'M', label: 'Move' },
  { key: 'A', label: 'Attack Level', sub: 'L = Low · M = Mid · H = High' },
  { key: 'D', label: 'Damage' },
  { key: 'S', label: 'Startup' },
  { key: 'H', label: 'On Hit' },
  { key: 'B', label: 'On Block' },
  { key: 'G', label: 'Meter Gained' },
];

function fmtAdv(min: number | null, max: number | null): { lines: string[]; color: string } {
  if (min === null) return { lines: ['—'], color: colors.textSecondary };
  const f = (n: number) => (n > 0 ? `+${n}` : `${n}`);
  const color = min >= 0 ? '#22c55e' : '#ef4444';
  if (min === max) return { lines: [f(min)], color };
  return { lines: [f(min), f(max!)], color };
}

function fmtLevel(lvl: string | null): string {
  if (!lvl) return '—';
  if (lvl === 'LOW') return 'L';
  if (lvl === 'HIGH') return 'H';
  if (lvl === 'MID') return 'M';
  return lvl;
}

function levelColor(lvl: string | null) {
  if (!lvl) return colors.textSecondary;
  if (lvl === 'LOW') return '#f59e0b';
  if (lvl === 'HIGH') return '#60a5fa';
  return '#a78bfa';
}

function sortData(data: FrameDataEntry[], key: SortKey, dir: SortDir): FrameDataEntry[] {
  return [...data].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
    return dir === 'asc' ? cmp : -cmp;
  });
}

export default function FrameDataScreen() {
  const { characterId } = useLocalSearchParams<{ characterId: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const rawData = getFrameData(characterId ?? '');

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [legendVisible, setLegendVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: characterId ? characterId.charAt(0).toUpperCase() + characterId.slice(1) : 'Frame Data',
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => setLegendVisible(true)} style={styles.helpBtn}>
          <Text style={styles.helpText}>?</Text>
        </TouchableOpacity>
      ),
    });
  }, [characterId, navigation, router]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else { setSortKey(null); }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const data = sortKey ? sortData(rawData, sortKey, sortDir) : rawData;

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return ' ↕';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  const sortColor = (key: SortKey) => sortKey === key ? colors.accent : colors.textSecondary;

  return (
    <View style={styles.container}>
      {/* Legend modal */}
      <Modal visible={legendVisible} transparent animationType="fade" onRequestClose={() => setLegendVisible(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setLegendVisible(false)}>
          <View style={styles.legendBox}>
            <Text style={styles.legendTitle}>Column Guide</Text>
            {LEGEND.map(({ key, label, sub }) => (
              <View key={key} style={styles.legendRow}>
                <Text style={styles.legendKey}>{key}</Text>
                <View>
                  <Text style={styles.legendLabel}>{label}</Text>
                  {sub ? <Text style={styles.legendSub}>{sub}</Text> : null}
                </View>
              </View>
            ))}
            <Text style={styles.legendDismiss}>Tap anywhere to close</Text>
          </View>
        </TouchableOpacity>
      </Modal>

      {rawData.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No frame data available yet.</Text>
        </View>
      ) : (
        // Outer vertical ScrollView — scroll through rows
        <ScrollView style={styles.outer} bounces={false}>
          {/* Inner horizontal ScrollView — scroll wide table */}
          <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false}>
            <View>
              {/* Header row */}
              <View style={[styles.row, styles.headerRow]}>
                <TouchableOpacity style={[styles.cell, { width: COL.move }]} onPress={() => handleSort('move')}>
                  <Text numberOfLines={1} style={[styles.headerText, { color: sortColor('move') }]}>M{sortIndicator('move')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cell, { width: COL.level }]} onPress={() => handleSort('attackLevel')}>
                  <Text numberOfLines={1} style={[styles.headerText, styles.textRight, { color: sortColor('attackLevel') }]}>A{sortIndicator('attackLevel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cell, { width: COL.dmg }]} onPress={() => handleSort('damage')}>
                  <Text numberOfLines={1} style={[styles.headerText, styles.textRight, { color: sortColor('damage') }]}>D{sortIndicator('damage')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cell, { width: COL.startup }]} onPress={() => handleSort('startup')}>
                  <Text numberOfLines={1} style={[styles.headerText, styles.textRight, { color: sortColor('startup') }]}>S{sortIndicator('startup')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cell, { width: COL.onHit }]} onPress={() => handleSort('onHitMin')}>
                  <Text numberOfLines={1} style={[styles.headerText, styles.textRight, { color: sortColor('onHitMin') }]}>H{sortIndicator('onHitMin')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cell, { width: COL.onBlock }]} onPress={() => handleSort('onBlockMin')}>
                  <Text numberOfLines={1} style={[styles.headerText, styles.textRight, { color: sortColor('onBlockMin') }]}>B{sortIndicator('onBlockMin')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cell, { width: COL.meter }]} onPress={() => handleSort('meterGain')}>
                  <Text numberOfLines={1} style={[styles.headerText, styles.textRight, { color: sortColor('meterGain') }]}>G{sortIndicator('meterGain')}</Text>
                </TouchableOpacity>
              </View>

              {/* Data rows */}
              {data.map((row, i) => {
                const hit = fmtAdv(row.onHitMin, row.onHitMax);
                const block = fmtAdv(row.onBlockMin, row.onBlockMax);
                const bg = i % 2 === 0 ? colors.background : colors.surface;
                return (
                  <View key={row.move + i} style={[styles.row, { backgroundColor: bg }]}>
                    <View style={[styles.cell, { width: COL.move }]}>
                      <ComboNotation notation={row.move} />
                    </View>
                    <View style={[styles.cell, { width: COL.level }]}>
                      <Text style={[styles.cellText, styles.textRight, { color: levelColor(row.attackLevel) }]}>
                        {fmtLevel(row.attackLevel)}
                      </Text>
                    </View>
                    <View style={[styles.cell, { width: COL.dmg }]}>
                      <Text style={[styles.cellText, styles.textRight]}>{row.damage ?? '—'}</Text>
                    </View>
                    <View style={[styles.cell, { width: COL.startup }]}>
                      <Text style={[styles.cellText, styles.textRight]}>{row.startup ?? '—'}</Text>
                    </View>
                    <View style={[styles.cell, { width: COL.onHit }]}>
                      {hit.lines.map((line, li) => (
                        <Text key={li} style={[styles.cellText, styles.textRight, { color: hit.color }]}>{line}</Text>
                      ))}
                    </View>
                    <View style={[styles.cell, { width: COL.onBlock }]}>
                      {block.lines.map((line, li) => (
                        <Text key={li} style={[styles.cellText, styles.textRight, { color: block.color }]}>{line}</Text>
                      ))}
                    </View>
                    <View style={[styles.cell, { width: COL.meter }]}>
                      <Text style={[styles.cellText, styles.textRight, { color: '#a78bfa' }]}>{row.meterGain ?? '—'}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  outer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    backgroundColor: colors.surface,
  },
  cell: {
    paddingHorizontal: 4,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  cellText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  textRight: {
    textAlign: 'right',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: colors.textSecondary,
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
  helpBtn: {
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 6,
  },
  helpText: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    width: 280,
    gap: 14,
  },
  legendTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  legendKey: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
    width: 20,
  },
  legendLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  legendSub: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  legendDismiss: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});
