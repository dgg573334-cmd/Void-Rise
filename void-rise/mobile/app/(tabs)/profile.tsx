import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import colors from '@/constants/colors';
import { COMPANIONS, TITLES, ACHIEVEMENTS } from '@/constants/gameData';

type ProfileTab = 'titles' | 'companions' | 'achievements';

export default function ProfileScreen() {
  const { state, setActiveCompanion } = useGame();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ProfileTab>('titles');
  const isRTL = language === 'ar';
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : insets.top;

  const currentTitle = TITLES.find((t) => t.id === state.titleId) || TITLES[0];

  const rarityColors: Record<string, string> = {
    common: colors.dark.textSecondary,
    rare: colors.dark.primary,
    epic: colors.dark.purple,
    legendary: colors.dark.gold,
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: 80 + (isWeb ? 34 : insets.bottom) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <GlowCard glowColor={colors.dark.primary} style={styles.profileHeader}>
          <View style={[styles.profileRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>⚔️</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { textAlign: isRTL ? 'right' : 'left' }]}>
                {user?.name || 'Void Hunter'}
              </Text>
              <Text style={[styles.profileEmail, { textAlign: isRTL ? 'right' : 'left' }]}>
                {user?.email}
              </Text>
              <View style={[styles.titleRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={styles.titleIcon}>{currentTitle.icon}</Text>
                <Text style={styles.titleName}>
                  {language === 'ar' ? currentTitle.nameAr : currentTitle.nameEn}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.statsRow}>
            {[
              { label: isRTL ? 'المستوى' : 'Level', val: state.level, color: colors.dark.primary },
              { label: isRTL ? 'خط النار' : 'Streak', val: `${state.streak}🔥`, color: colors.dark.gold },
              { label: isRTL ? 'الذهب' : 'Gold', val: state.gold.toLocaleString(), color: colors.dark.gold },
            ].map((s, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </GlowCard>

        {/* Active Companion */}
        {state.activeCompanion && (
          <GlowCard glowColor={colors.dark.violet} style={styles.companionActive}>
            {(() => {
              const comp = COMPANIONS.find((c) => c.id === state.activeCompanion);
              if (!comp) return null;
              return (
                <View style={[styles.activeCompRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Text style={styles.activeCompIcon}>{comp.icon}</Text>
                  <View>
                    <Text style={[styles.activeCompName, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {language === 'ar' ? comp.nameAr : comp.nameEn}
                    </Text>
                    <Text style={[styles.activeCompBonus, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {language === 'ar' ? comp.bonusAr : comp.bonusEn}
                    </Text>
                  </View>
                  <Text style={styles.equipBadge}>{t('equiped')}</Text>
                </View>
              );
            })()}
          </GlowCard>
        )}

        {/* Tab Bar */}
        <View style={[styles.tabBar, isRTL && { flexDirection: 'row-reverse' }]}>
          {(['titles', 'companions', 'achievements'] as ProfileTab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === 'titles' ? t('titles') : tab === 'companions' ? t('companions') : t('achievements')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Titles */}
        {activeTab === 'titles' && (
          <View style={styles.grid}>
            {TITLES.map((title) => {
              const unlocked = state.unlockedTitles.includes(title.id);
              return (
                <GlowCard
                  key={title.id}
                  glowColor={unlocked ? rarityColors[title.rarity] : colors.dark.cardBorder}
                  style={[styles.gridItem, !unlocked && styles.lockedItem]}
                >
                  <Text style={styles.gridIcon}>{unlocked ? title.icon : '🔒'}</Text>
                  <Text style={[styles.gridName, { color: unlocked ? rarityColors[title.rarity] : colors.dark.textMuted, textAlign: 'center' }]}>
                    {language === 'ar' ? title.nameAr : title.nameEn}
                  </Text>
                  <Text style={[styles.gridCond, { textAlign: 'center' }]}>
                    {language === 'ar' ? title.conditionAr : title.conditionEn}
                  </Text>
                </GlowCard>
              );
            })}
          </View>
        )}

        {/* Companions */}
        {activeTab === 'companions' && (
          <>
            {state.companions.length === 0 ? (
              <GlowCard style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>🐾</Text>
                <Text style={[styles.emptyText, { textAlign: 'center' }]}>{t('noCompanions')}</Text>
                <Text style={[styles.emptyDesc, { textAlign: 'center' }]}>{t('unlockCompanions')}</Text>
              </GlowCard>
            ) : (
              <View style={styles.grid}>
                {COMPANIONS.filter((c) => state.companions.includes(c.id)).map((comp) => (
                  <GlowCard key={comp.id} glowColor={comp.color} style={styles.gridItem}>
                    <Text style={styles.gridIcon}>{comp.icon}</Text>
                    <Text style={[styles.gridName, { color: comp.color, textAlign: 'center' }]}>
                      {language === 'ar' ? comp.nameAr : comp.nameEn}
                    </Text>
                    <Text style={[styles.gridCond, { textAlign: 'center' }]}>
                      {language === 'ar' ? comp.bonusAr : comp.bonusEn}
                    </Text>
                    <TouchableOpacity
                      style={[styles.equipBtn, state.activeCompanion === comp.id && styles.equippedBtn]}
                      onPress={() => setActiveCompanion(state.activeCompanion === comp.id ? null : comp.id)}
                    >
                      <Text style={styles.equipBtnText}>
                        {state.activeCompanion === comp.id ? (isRTL ? 'إلغاء' : 'Unequip') : (isRTL ? 'تجهيز' : 'Equip')}
                      </Text>
                    </TouchableOpacity>
                  </GlowCard>
                ))}
              </View>
            )}
            <GlowCard style={styles.allCompanions}>
              <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {language === 'ar' ? '📋 جميع الرفاق' : '📋 All Companions'}
              </Text>
              {COMPANIONS.map((comp) => (
                <View key={comp.id} style={[styles.compListItem, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Text style={styles.compListIcon}>{comp.icon}</Text>
                  <View style={styles.compListInfo}>
                    <Text style={[styles.compListName, { color: comp.color, textAlign: isRTL ? 'right' : 'left' }]}>
                      {language === 'ar' ? comp.nameAr : comp.nameEn}
                    </Text>
                    <Text style={[styles.compListCond, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {language === 'ar' ? comp.unlockConditionAr : comp.unlockConditionEn}
                    </Text>
                  </View>
                  {state.companions.includes(comp.id) && <Text style={styles.ownedBadge}>✅</Text>}
                </View>
              ))}
            </GlowCard>
          </>
        )}

        {/* Achievements */}
        {activeTab === 'achievements' && (
          <View style={styles.grid}>
            {ACHIEVEMENTS.map((ach) => {
              const unlocked = state.achievements.includes(ach.id);
              return (
                <GlowCard key={ach.id} glowColor={unlocked ? colors.dark.gold : colors.dark.cardBorder} style={[styles.gridItem, !unlocked && styles.lockedItem]}>
                  <Text style={styles.gridIcon}>{unlocked ? ach.icon : '🔒'}</Text>
                  <Text style={[styles.gridName, { color: unlocked ? colors.dark.gold : colors.dark.textMuted, textAlign: 'center' }]}>
                    {language === 'ar' ? ach.nameAr : ach.nameEn}
                  </Text>
                  <Text style={[styles.gridCond, { textAlign: 'center' }]}>
                    {language === 'ar' ? ach.descAr : ach.descEn}
                  </Text>
                </GlowCard>
              );
            })}
          </View>
        )}

        <NeonButton
          title={t('settings')}
          onPress={() => router.push('/settings')}
          variant="outline"
          style={styles.settingsBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  scroll: { flex: 1 },
  content: { padding: 16 },
  profileHeader: { marginBottom: 12 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 14 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.dark.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: { fontSize: 30 },
  profileInfo: { flex: 1 },
  profileName: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 18, marginBottom: 2 },
  profileEmail: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 12, marginBottom: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  titleIcon: { fontSize: 14 },
  titleName: { color: colors.dark.gold, fontFamily: 'Cairo_600SemiBold', fontSize: 13 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: colors.dark.cardBorder, paddingTop: 12 },
  statItem: { alignItems: 'center' },
  statVal: { fontFamily: 'Cairo_700Bold', fontSize: 18 },
  statLabel: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 12, marginTop: 2 },
  companionActive: { marginBottom: 12 },
  activeCompRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activeCompIcon: { fontSize: 32 },
  activeCompName: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 15 },
  activeCompBonus: { color: colors.dark.violet, fontFamily: 'Cairo_400Regular', fontSize: 13 },
  equipBadge: { marginLeft: 'auto', color: colors.dark.green, fontFamily: 'Cairo_700Bold', fontSize: 12 },
  tabBar: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark.cardBorder,
    alignItems: 'center',
  },
  activeTab: { backgroundColor: colors.dark.primary, borderColor: colors.dark.primary },
  tabText: { color: colors.dark.textSecondary, fontFamily: 'Cairo_600SemiBold', fontSize: 12 },
  activeTabText: { color: '#000' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  gridItem: { width: '47%', alignItems: 'center', padding: 14, gap: 6 },
  lockedItem: { opacity: 0.5 },
  gridIcon: { fontSize: 28 },
  gridName: { fontFamily: 'Cairo_700Bold', fontSize: 13 },
  gridCond: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 11 },
  equipBtn: {
    backgroundColor: colors.dark.violet + '33',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.dark.violet,
    marginTop: 4,
  },
  equippedBtn: { backgroundColor: colors.dark.green + '33', borderColor: colors.dark.green },
  equipBtnText: { color: colors.dark.text, fontFamily: 'Cairo_600SemiBold', fontSize: 11 },
  emptyCard: { alignItems: 'center', padding: 32, marginBottom: 12 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 16, marginBottom: 8 },
  emptyDesc: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 14 },
  allCompanions: { marginBottom: 16 },
  sectionTitle: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 15, marginBottom: 12 },
  compListItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  compListIcon: { fontSize: 24 },
  compListInfo: { flex: 1 },
  compListName: { fontFamily: 'Cairo_700Bold', fontSize: 14 },
  compListCond: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 12 },
  ownedBadge: { fontSize: 18 },
  settingsBtn: { marginTop: 8 },
});
