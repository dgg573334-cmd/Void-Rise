import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { QuestCard } from '@/components/QuestCard';
import { GlowCard } from '@/components/ui/GlowCard';
import colors from '@/constants/colors';
import { DAILY_QUESTS, WEEKLY_QUESTS, BOSS_RAIDS } from '@/constants/gameData';

const TABS = ['daily', 'weekly', 'boss'] as const;
type Tab = (typeof TABS)[number];

const QUEST_ICONS = ['💪', '👣', '🧠'];
const WEEKLY_ICONS = ['🔥', '🏋️', '📚'];
const BOSS_ICONS = ['🐉', '📚', '🏋️'];

export default function QuestsScreen() {
  const { state } = useGame();
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('daily');
  const isRTL = language === 'ar';
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : insets.top;

  const tabLabels: Record<Tab, string> = {
    daily: t('dailyQuests'),
    weekly: t('weeklyQuests'),
    boss: t('bossRaid'),
  };

  const questProgressList = [
    { progress: state.questProgress.exercises, complete: state.questProgress.exercisesComplete },
    { progress: state.questProgress.steps, complete: state.questProgress.stepsComplete },
    { progress: state.questProgress.focus, complete: state.questProgress.focusComplete },
  ];

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.pageTitle, { textAlign: isRTL ? 'right' : 'left' }]}>⚔️ {t('quests')}</Text>
      </View>

      {/* Tab Bar */}
      <View style={[styles.tabBar, isRTL && { flexDirection: 'row-reverse' }]}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tabLabels[tab]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: 80 + (isWeb ? 34 : insets.bottom) }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'daily' && (
          <>
            {DAILY_QUESTS.map((q, i) => (
              <QuestCard
                key={q.id}
                icon={QUEST_ICONS[i]}
                name={language === 'ar' ? q.nameAr : q.nameEn}
                desc={language === 'ar' ? q.descAr : q.descEn}
                progress={questProgressList[i].progress}
                target={q.target}
                unit={q.unit}
                xpReward={q.xpReward}
                goldReward={q.goldReward}
                completed={questProgressList[i].complete}
                language={language}
              />
            ))}
            <GlowCard glowColor={colors.dark.premiumGold} style={styles.bonusCard}>
              <Text style={[styles.bonusTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                🎯 {language === 'ar' ? 'مكافأة الإكمال الكامل' : 'Full Completion Bonus'}
              </Text>
              <Text style={[styles.bonusDesc, { textAlign: isRTL ? 'right' : 'left' }]}>
                +50 XP + 50 🪙
              </Text>
            </GlowCard>
          </>
        )}

        {activeTab === 'weekly' && (
          <>
            {WEEKLY_QUESTS.map((q, i) => (
              <QuestCard
                key={q.id}
                icon={WEEKLY_ICONS[i]}
                name={language === 'ar' ? q.nameAr : q.nameEn}
                desc={language === 'ar' ? q.descAr : q.descEn}
                progress={0}
                target={q.target}
                unit={q.unit}
                xpReward={q.xpReward}
                goldReward={q.goldReward}
                completed={false}
                language={language}
              />
            ))}
          </>
        )}

        {activeTab === 'boss' && (
          <>
            <GlowCard glowColor={colors.dark.red} style={styles.bossWarning}>
              <Text style={[styles.bossWarnText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {language === 'ar'
                  ? '⚠️ غارات الزعيم هي تحديات شهرية ضخمة. جهّز نفسك!'
                  : '⚠️ Boss Raids are epic monthly challenges. Prepare yourself!'}
              </Text>
            </GlowCard>
            {BOSS_RAIDS.map((q, i) => (
              <QuestCard
                key={q.id}
                icon={BOSS_ICONS[i]}
                name={language === 'ar' ? q.nameAr : q.nameEn}
                desc={language === 'ar' ? q.descAr : q.descEn}
                progress={0}
                target={q.target}
                unit={q.unit}
                xpReward={q.xpReward}
                goldReward={q.goldReward}
                completed={false}
                language={language}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  headerRow: { paddingHorizontal: 16, paddingBottom: 8 },
  pageTitle: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold', fontSize: 22 },
  tabBar: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12, gap: 8 },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark.cardBorder,
    alignItems: 'center',
  },
  activeTab: { backgroundColor: colors.dark.primary, borderColor: colors.dark.primary },
  tabText: { color: colors.dark.textSecondary, fontFamily: 'Cairo_600SemiBold', fontSize: 12 },
  activeTabText: { color: '#000' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingTop: 0 },
  bonusCard: { marginTop: 4 },
  bonusTitle: { color: colors.dark.gold, fontFamily: 'Cairo_700Bold', fontSize: 15, marginBottom: 4 },
  bonusDesc: { color: colors.dark.green, fontFamily: 'Cairo_600SemiBold', fontSize: 14 },
  bossWarning: { marginBottom: 12 },
  bossWarnText: { color: colors.dark.red, fontFamily: 'Cairo_600SemiBold', fontSize: 14 },
});
