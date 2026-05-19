import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { GlowCard } from '@/components/ui/GlowCard';
import colors from '@/constants/colors';

type RankTab = 'xp' | 'gold' | 'streak';

const MOCK_PLAYERS = [
  { name: 'VoidMaster', level: 42, xp: 2_450_000, gold: 125000, streak: 180, title: '💀' },
  { name: 'PhoenixRiser', level: 35, xp: 1_800_000, gold: 98000, streak: 90, title: '🔥' },
  { name: 'ShadowKnight', level: 28, xp: 980_000, gold: 74000, streak: 45, title: '⚔️' },
  { name: 'DarkSage', level: 22, xp: 550_000, gold: 52000, streak: 33, title: '📚' },
  { name: 'IronWolf', level: 18, xp: 320_000, gold: 38000, streak: 21, title: '🐺' },
  { name: 'CyberRogue', level: 15, xp: 200_000, gold: 28000, streak: 14, title: '🤖' },
  { name: 'VoidWalker', level: 12, xp: 110_000, gold: 18000, streak: 9, title: '🚶' },
];

const RANK_COLORS = [colors.dark.gold, '#C0C0C0', '#CD7F32'];

export default function RankingsScreen() {
  const { state } = useGame();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<RankTab>('xp');
  const isRTL = language === 'ar';
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : insets.top;

  const myEntry = {
    name: user?.name || 'You',
    level: state.level,
    xp: state.totalXp,
    gold: state.gold,
    streak: state.streak,
    title: '⚔️',
  };

  const sortedPlayers = [...MOCK_PLAYERS, { ...myEntry, isMe: true }].sort((a, b) => {
    if (activeTab === 'xp') return b.xp - a.xp;
    if (activeTab === 'gold') return b.gold - a.gold;
    return b.streak - a.streak;
  });

  const tabLabels: Record<RankTab, string> = {
    xp: isRTL ? '🏆 الأقوى' : '🏆 Top XP',
    gold: isRTL ? '💰 الأغنى' : '💰 Richest',
    streak: isRTL ? '🔥 الالتزام' : '🔥 Streak',
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← {language === 'ar' ? 'رجوع' : 'Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🏆 {t('rankings')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={[styles.tabBar, isRTL && { flexDirection: 'row-reverse' }]}>
        {(Object.keys(tabLabels) as RankTab[]).map((tab) => (
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
        contentContainerStyle={[styles.content, { paddingBottom: isWeb ? 50 : insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {sortedPlayers.map((player, i) => {
          const isMe = 'isMe' in player && player.isMe;
          const rankColor = i < 3 ? RANK_COLORS[i] : colors.dark.textSecondary;
          const val = activeTab === 'xp' ? player.xp.toLocaleString() + ' XP'
            : activeTab === 'gold' ? '🪙 ' + player.gold.toLocaleString()
            : '🔥 ' + player.streak;

          return (
            <GlowCard
              key={player.name + i}
              glowColor={isMe ? colors.dark.primary : i === 0 ? colors.dark.gold : colors.dark.cardBorder}
              style={[styles.rankCard, isMe && styles.myCard]}
            >
              <View style={[styles.rankRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.rankNum, { color: rankColor }]}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </Text>
                <Text style={styles.playerTitle}>{player.title}</Text>
                <View style={styles.playerInfo}>
                  <Text style={[styles.playerName, isMe && { color: colors.dark.primary }, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {isMe ? `${isRTL ? 'أنت' : 'You'} (${player.name})` : player.name}
                  </Text>
                  <Text style={[styles.playerLevel, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {isRTL ? `المستوى ${player.level}` : `Level ${player.level}`}
                  </Text>
                </View>
                <Text style={[styles.playerVal, { color: rankColor }]}>{val}</Text>
              </View>
            </GlowCard>
          );
        })}

        <GlowCard style={styles.challengeCard}>
          <Text style={[styles.challengeTitle, { textAlign: 'center' }]}>
            {isRTL ? '🎯 تحديات المجتمع' : '🎯 Community Challenges'}
          </Text>
          <Text style={[styles.challengeDesc, { textAlign: 'center' }]}>
            {isRTL ? 'سباق الخطوات الأسبوعي — تبدأ الاثنين القادم' : 'Weekly Steps Race — Starting next Monday'}
          </Text>
        </GlowCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 8 },
  backBtn: { color: colors.dark.primary, fontFamily: 'Cairo_600SemiBold', fontSize: 14, width: 60 },
  title: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 20 },
  tabBar: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8, gap: 8 },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark.cardBorder,
    alignItems: 'center',
  },
  activeTab: { backgroundColor: colors.dark.primary, borderColor: colors.dark.primary },
  tabText: { color: colors.dark.textSecondary, fontFamily: 'Cairo_600SemiBold', fontSize: 11 },
  activeTabText: { color: '#000' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingTop: 8 },
  rankCard: { marginBottom: 8, padding: 12 },
  myCard: { borderColor: colors.dark.primary },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankNum: { fontFamily: 'Cairo_700Bold', fontSize: 18, width: 36, textAlign: 'center' },
  playerTitle: { fontSize: 20 },
  playerInfo: { flex: 1 },
  playerName: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 14 },
  playerLevel: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 12 },
  playerVal: { fontFamily: 'Cairo_700Bold', fontSize: 13 },
  challengeCard: { marginTop: 8, padding: 20, gap: 8 },
  challengeTitle: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold', fontSize: 16 },
  challengeDesc: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 14 },
});
