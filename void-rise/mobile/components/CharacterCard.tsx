import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '@/constants/colors';
import { GlowCard } from '@/components/ui/GlowCard';
import { XPBar } from '@/components/ui/XPBar';
import { StatBar } from '@/components/ui/StatBar';
import { TITLES, STAT_ICONS } from '@/constants/gameData';
import type { StatType } from '@/constants/gameData';
import type { PlayerStats } from '@/context/GameContext';
import type { Language } from '@/constants/translations';

const STAT_LABELS: Record<StatType, { ar: string; en: string }> = {
  str: { ar: 'القوة', en: 'STR' },
  agi: { ar: 'السرعة', en: 'AGI' },
  vit: { ar: 'التحمل', en: 'VIT' },
  int: { ar: 'الذكاء', en: 'INT' },
  spi: { ar: 'الروح', en: 'SPI' },
};

interface CharacterCardProps {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  titleId: string;
  stats: PlayerStats;
  streak: number;
  language: Language;
}

export function CharacterCard({ name, level, xp, xpToNext, titleId, stats, streak, language }: CharacterCardProps) {
  const title = TITLES.find((t) => t.id === titleId) || TITLES[0];
  const isRTL = language === 'ar';

  return (
    <GlowCard glowColor={colors.dark.primary} style={styles.card}>
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>⚔️</Text>
        </View>
        <View style={styles.nameBlock}>
          <Text style={[styles.name, { textAlign: isRTL ? 'right' : 'left' }]}>{name}</Text>
          <View style={[styles.titleRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.titleIcon}>{title.icon}</Text>
            <Text style={styles.titleName}>{language === 'ar' ? title.nameAr : title.nameEn}</Text>
          </View>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakNum}>{streak}</Text>
        </View>
      </View>

      <XPBar xp={xp} xpToNext={xpToNext} level={level} />

      <View style={styles.statsRow}>
        {(Object.keys(stats) as StatType[]).map((stat) => (
          <View key={stat} style={styles.statItem}>
            <Text style={styles.statIcon}>{STAT_ICONS[stat]}</Text>
            <Text style={styles.statVal}>{stats[stat]}</Text>
          </View>
        ))}
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  headerRTL: { flexDirection: 'row-reverse' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dark.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 24 },
  nameBlock: { flex: 1 },
  name: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 18, marginBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  titleIcon: { fontSize: 14 },
  titleName: { color: colors.dark.gold, fontFamily: 'Cairo_600SemiBold', fontSize: 13 },
  streakBadge: { alignItems: 'center' },
  streakFire: { fontSize: 18 },
  streakNum: { color: colors.dark.gold, fontFamily: 'Cairo_700Bold', fontSize: 14 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.dark.cardBorder,
  },
  statItem: { alignItems: 'center', gap: 2 },
  statIcon: { fontSize: 18 },
  statVal: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 14 },
});
