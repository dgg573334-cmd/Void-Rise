import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { StatBar } from '@/components/ui/StatBar';
import { GlowCard } from '@/components/ui/GlowCard';
import { XPBar } from '@/components/ui/XPBar';
import colors from '@/constants/colors';
import type { StatType } from '@/constants/gameData';

const STAT_LABELS: Record<StatType, { ar: string; en: string }> = {
  str: { ar: 'القوة', en: 'Strength' },
  agi: { ar: 'السرعة', en: 'Speed' },
  vit: { ar: 'التحمل', en: 'Vitality' },
  int: { ar: 'الذكاء', en: 'Intelligence' },
  spi: { ar: 'الروح', en: 'Spirit' },
};

const STAT_SOURCES: Record<StatType, { ar: string; en: string }> = {
  str: { ar: 'تمارين مقاومة، رفع أثقال', en: 'Resistance training, weightlifting' },
  agi: { ar: 'جري، خطوات سريعة', en: 'Running, fast steps' },
  vit: { ar: 'أيام الالتزام، تمارين طويلة', en: 'Commitment days, long workouts' },
  int: { ar: 'قراءة، مذاكرة، برمجة', en: 'Reading, studying, coding' },
  spi: { ar: 'تأمل، تحديات عقلية', en: 'Meditation, mental challenges' },
};

export default function StatsScreen() {
  const { state, distributeStat } = useGame();
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const isRTL = language === 'ar';
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : insets.top;
  const { stats, statPoints, level, xp, xpToNext, totalXp } = state;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: 80 + (isWeb ? 34 : insets.bottom) }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.pageTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          📊 {t('stats')}
        </Text>

        {/* Level & XP */}
        <GlowCard glowColor={colors.dark.primary} style={styles.xpCard}>
          <XPBar xp={xp} xpToNext={xpToNext} level={level} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t('totalXP')}</Text>
            <Text style={styles.totalValue}>{totalXp.toLocaleString()}</Text>
          </View>
        </GlowCard>

        {/* Stat Points Available */}
        {statPoints > 0 && (
          <GlowCard glowColor={colors.dark.gold} style={styles.pointsBanner}>
            <Text style={[styles.pointsText, { textAlign: isRTL ? 'right' : 'left' }]}>
              ⭐ {statPoints} {t('pointsAvailable')}
            </Text>
          </GlowCard>
        )}

        {/* Stats */}
        <GlowCard style={styles.statsCard}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('distribute')}
          </Text>
          {(Object.keys(stats) as StatType[]).map((stat) => (
            <StatBar
              key={stat}
              stat={stat}
              value={stats[stat]}
              labelAr={STAT_LABELS[stat].ar}
              labelEn={STAT_LABELS[stat].en}
              language={language}
              onAdd={() => distributeStat(stat)}
              canAdd={statPoints > 0}
            />
          ))}
        </GlowCard>

        {/* Stat Sources */}
        <GlowCard style={styles.sourcesCard}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {language === 'ar' ? '💡 كيف تطور إحصائياتك؟' : '💡 How to improve stats?'}
          </Text>
          {(Object.keys(stats) as StatType[]).map((stat) => (
            <View key={stat} style={[styles.sourceRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={styles.sourceIcon}>
                {stat === 'str' ? '💪' : stat === 'agi' ? '🏃' : stat === 'vit' ? '🛡️' : stat === 'int' ? '🧠' : '🌟'}
              </Text>
              <View style={styles.sourceInfo}>
                <Text style={[styles.sourceStat, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {language === 'ar' ? STAT_LABELS[stat].ar : STAT_LABELS[stat].en}
                </Text>
                <Text style={[styles.sourceDesc, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {language === 'ar' ? STAT_SOURCES[stat].ar : STAT_SOURCES[stat].en}
                </Text>
              </View>
            </View>
          ))}
        </GlowCard>

        {/* Multipliers */}
        <GlowCard style={styles.multipliersCard}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {language === 'ar' ? '⚡ معاملات الصعوبة' : '⚡ Difficulty Multipliers'}
          </Text>
          {[
            { rank: 'D-Rank', label: language === 'ar' ? 'عادي' : 'Normal', mult: '1.0x', color: colors.dark.textSecondary },
            { rank: 'C-Rank', label: language === 'ar' ? 'متوسط' : 'Medium', mult: '1.5x', color: colors.dark.green },
            { rank: 'B-Rank', label: language === 'ar' ? 'صعب' : 'Hard', mult: '2.5x', color: colors.dark.gold },
            { rank: 'A-Rank', label: language === 'ar' ? 'زعيم' : 'Boss', mult: '4.0x', color: colors.dark.red },
          ].map((r) => (
            <View key={r.rank} style={[styles.multRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={[styles.rank, { color: r.color }]}>{r.rank}</Text>
              <Text style={styles.rankLabel}>{r.label}</Text>
              <Text style={[styles.mult, { color: r.color }]}>{r.mult}</Text>
            </View>
          ))}
        </GlowCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  scroll: { flex: 1 },
  content: { padding: 16 },
  pageTitle: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold', fontSize: 22, marginBottom: 16 },
  xpCard: { marginBottom: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.dark.cardBorder },
  totalLabel: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 13 },
  totalValue: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold', fontSize: 14 },
  pointsBanner: { marginBottom: 12 },
  pointsText: { color: colors.dark.gold, fontFamily: 'Cairo_700Bold', fontSize: 15 },
  statsCard: { marginBottom: 12 },
  sectionTitle: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 15, marginBottom: 16 },
  sourcesCard: { marginBottom: 12 },
  sourceRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 10 },
  sourceIcon: { fontSize: 22, marginTop: 2 },
  sourceInfo: { flex: 1 },
  sourceStat: { color: colors.dark.text, fontFamily: 'Cairo_600SemiBold', fontSize: 14 },
  sourceDesc: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 12, marginTop: 2 },
  multipliersCard: {},
  multRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 12 },
  rank: { fontFamily: 'Cairo_700Bold', fontSize: 14, width: 60 },
  rankLabel: { flex: 1, color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 14 },
  mult: { fontFamily: 'Cairo_700Bold', fontSize: 16 },
});
