import { router } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { CharacterCard } from '@/components/CharacterCard';
import { QuestCard } from '@/components/QuestCard';
import { LevelUpModal } from '@/components/LevelUpModal';
import { PenaltyOverlay } from '@/components/PenaltyOverlay';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import colors from '@/constants/colors';
import { DAILY_QUESTS } from '@/constants/gameData';

const QUEST_ICONS = ['💪', '👣', '🧠'];

export default function HomeScreen() {
  const { state, levelUpModal, dismissLevelUp, newLevel, penaltyOverlay, dismissPenalty } = useGame();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const isRTL = language === 'ar';
  const isWeb = Platform.OS === 'web';

  const questProgressList = [
    { progress: state.questProgress.exercises, complete: state.questProgress.exercisesComplete },
    { progress: state.questProgress.steps, complete: state.questProgress.stepsComplete },
    { progress: state.questProgress.focus, complete: state.questProgress.focusComplete },
  ];

  const topPad = isWeb ? 67 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: 80 + (isWeb ? 34 : insets.bottom) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, isRTL && styles.headerRTL]}>
          <Text style={styles.appTitle}>⚡ VOID RISE</Text>
          <TouchableOpacity style={styles.goldChip} onPress={() => router.push('/shop')}>
            <Text style={styles.goldText}>🪙 {state.gold.toLocaleString()}</Text>
          </TouchableOpacity>
        </View>

        {/* Character Card */}
        <CharacterCard
          name={user?.name || state.name}
          level={state.level}
          xp={state.xp}
          xpToNext={state.xpToNext}
          titleId={state.titleId}
          stats={state.stats}
          streak={state.streak}
          language={language}
        />

        {/* Daily Quests */}
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? '📋 مهام اليوم' : '📋 Daily Quests'}
        </Text>

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

        {state.questProgress.allCompletedToday && (
          <GlowCard glowColor={colors.dark.green} style={styles.completedBanner}>
            <Text style={styles.completedText}>
              🎉 {t('dailyComplete')} +50 XP +50 🪙
            </Text>
          </GlowCard>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <NeonButton
            title={isRTL ? '+ سجل نشاط' : '+ Log Activity'}
            onPress={() => router.push('/log')}
            style={styles.actionBtn}
            variant="outline"
          />
          <NeonButton
            title={isRTL ? '⚔️ مهام' : '⚔️ Quests'}
            onPress={() => router.push('/quests')}
            color={colors.dark.gold}
            style={styles.actionBtn}
            variant="outline"
          />
        </View>

        {/* Minigames Row */}
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          🎮 {t('minigames')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.minigamesRow}>
          {[
            { name: isRTL ? 'معركة زعيم' : 'Boss Fight', icon: '⚔️', route: '/minigames/boss-fight' as const },
            { name: isRTL ? 'هروب الفراغ' : 'Void Run', icon: '🏃', route: '/minigames/void-run' as const },
            { name: isRTL ? 'بوابة العقل' : 'Mind Gate', icon: '🧠', route: '/minigames/mind-gate' as const },
          ].map((game) => (
            <TouchableOpacity
              key={game.name}
              style={styles.minigameCard}
              onPress={() => router.push(game.route)}
              activeOpacity={0.8}
            >
              <Text style={styles.minigameIcon}>{game.icon}</Text>
              <Text style={styles.minigameName}>{game.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      <LevelUpModal visible={levelUpModal} level={newLevel} onDismiss={dismissLevelUp} language={language} />
      <PenaltyOverlay visible={penaltyOverlay} onDismiss={dismissPenalty} language={language} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  scroll: { flex: 1 },
  content: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerRTL: { flexDirection: 'row-reverse' },
  appTitle: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold', fontSize: 18, letterSpacing: 2 },
  goldChip: {
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.gold,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  goldText: { color: colors.dark.gold, fontFamily: 'Cairo_700Bold', fontSize: 14 },
  sectionTitle: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 16, marginBottom: 12, marginTop: 8 },
  completedBanner: { marginBottom: 12 },
  completedText: { color: colors.dark.green, fontFamily: 'Cairo_700Bold', fontSize: 14, textAlign: 'center' },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  actionBtn: { flex: 1 },
  minigamesRow: { marginBottom: 12 },
  minigameCard: {
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.cardBorder,
    borderRadius: colors.radius,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
    width: 100,
  },
  minigameIcon: { fontSize: 32, marginBottom: 8 },
  minigameName: { color: colors.dark.text, fontFamily: 'Cairo_600SemiBold', fontSize: 12, textAlign: 'center' },
});
