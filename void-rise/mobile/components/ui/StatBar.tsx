import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '@/constants/colors';
import { STAT_COLORS, STAT_ICONS } from '@/constants/gameData';
import type { StatType } from '@/constants/gameData';

interface StatBarProps {
  stat: StatType;
  value: number;
  labelAr: string;
  labelEn: string;
  language: 'ar' | 'en';
  onAdd?: () => void;
  canAdd?: boolean;
  compact?: boolean;
}

export function StatBar({ stat, value, labelAr, labelEn, language, onAdd, canAdd, compact }: StatBarProps) {
  const color = STAT_COLORS[stat];
  const icon = STAT_ICONS[stat];
  const label = language === 'ar' ? labelAr : labelEn;
  const maxDisplay = 50;
  const pct = Math.min(value / maxDisplay, 1);

  return (
    <View style={[styles.container, compact && styles.compact]}>
      <View style={styles.row}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.label, { color }]}>{label}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {onAdd && (
          <TouchableOpacity
            onPress={onAdd}
            disabled={!canAdd}
            style={[styles.addBtn, { borderColor: color }, !canAdd && styles.addBtnDisabled]}
          >
            <Text style={[styles.addText, { color: canAdd ? color : colors.dark.textMuted }]}>+</Text>
          </TouchableOpacity>
        )}
      </View>
      {!compact && (
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  compact: { marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  icon: { fontSize: 16, marginRight: 6 },
  label: { flex: 1, fontFamily: 'Cairo_600SemiBold', fontSize: 14 },
  value: { fontFamily: 'Cairo_700Bold', fontSize: 16, marginRight: 8 },
  track: {
    height: 5,
    backgroundColor: colors.dark.cardBorder,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3 },
  addBtn: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: { borderColor: colors.dark.textMuted },
  addText: { fontSize: 18, fontWeight: '700', lineHeight: 22 },
});
