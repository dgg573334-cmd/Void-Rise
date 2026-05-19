import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import colors from '@/constants/colors';
import { SHOP_ITEMS } from '@/constants/gameData';

type ShopTab = 'virtual' | 'real' | 'premium';

export default function ShopScreen() {
  const { state, spendGold } = useGame();
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ShopTab>('virtual');
  const isRTL = language === 'ar';
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : insets.top;

  const virtualItems = SHOP_ITEMS.filter((i) => i.category === 'virtual');
  const realItems = SHOP_ITEMS.filter((i) => i.category === 'real');

  const handleBuyVirtual = (itemId: string, price: number, name: string) => {
    if (state.gold < price) {
      Alert.alert(
        isRTL ? 'ذهب غير كافٍ' : 'Not enough gold',
        isRTL ? `تحتاج ${price} ذهب` : `You need ${price} gold`,
      );
      return;
    }
    Alert.alert(
      isRTL ? 'تأكيد الشراء' : 'Confirm Purchase',
      `${name} — ${price} 🪙`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('buy'),
          onPress: () => {
            spendGold(price);
            Alert.alert('✅', isRTL ? 'تم الشراء بنجاح!' : 'Purchase successful!');
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← {language === 'ar' ? 'رجوع' : 'Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🛒 {t('shop')}</Text>
        <Text style={styles.goldBal}>🪙 {state.gold.toLocaleString()}</Text>
      </View>

      <View style={[styles.tabBar, isRTL && { flexDirection: 'row-reverse' }]}>
        {(['virtual', 'real', 'premium'] as ShopTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'virtual' ? t('virtual') : tab === 'real' ? t('real') : 'Premium'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: isWeb ? 50 : insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'virtual' && (
          <>
            <Text style={[styles.sectionNote, { textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? '🪙 المتجر الافتراضي — يُشترى بالذهب' : '🪙 Virtual Shop — Purchased with Gold'}
            </Text>
            {virtualItems.map((item) => (
              <GlowCard key={item.id} style={styles.itemCard}>
                <View style={[styles.itemRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {language === 'ar' ? item.nameAr : item.nameEn}
                    </Text>
                    <Text style={[styles.itemDesc, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {language === 'ar' ? item.descAr : item.descEn}
                    </Text>
                  </View>
                  <View style={styles.itemBuy}>
                    <Text style={styles.itemPrice}>🪙 {item.price}</Text>
                    <TouchableOpacity
                      style={[styles.buyBtn, state.gold < (item.price as number) && styles.buyBtnDisabled]}
                      onPress={() => handleBuyVirtual(item.id, item.price as number, language === 'ar' ? item.nameAr : item.nameEn)}
                    >
                      <Text style={styles.buyBtnText}>{t('buy')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </GlowCard>
            ))}
          </>
        )}

        {activeTab === 'real' && (
          <>
            <Text style={[styles.sectionNote, { textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? '💎 المتجر الحقيقي — مشتريات بفلوس حقيقية' : '💎 Real Shop — Real money purchases'}
            </Text>
            {realItems.map((item) => (
              <GlowCard key={item.id} glowColor={colors.dark.premiumGold} style={styles.itemCard}>
                <View style={[styles.itemRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {language === 'ar' ? item.nameAr : item.nameEn}
                    </Text>
                    <Text style={[styles.itemDesc, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {language === 'ar' ? item.descAr : item.descEn}
                    </Text>
                  </View>
                  <View style={styles.itemBuy}>
                    <Text style={styles.realPrice}>${item.price}</Text>
                    <TouchableOpacity style={styles.buyBtnReal}>
                      <Text style={styles.buyBtnRealText}>{t('buy')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </GlowCard>
            ))}
          </>
        )}

        {activeTab === 'premium' && (
          <>
            <GlowCard glowColor={colors.dark.premiumGold} style={styles.premiumCard}>
              <Text style={[styles.premiumTitle, { textAlign: 'center' }]}>💎 {t('premium')}</Text>
              <Text style={[styles.premiumSubtitle, { textAlign: 'center' }]}>
                {isRTL ? 'ارتقِ إلى المستوى التالي' : 'Rise to the next level'}
              </Text>
              {[
                isRTL ? '✨ بدون إعلانات' : '✨ No ads',
                isRTL ? '🧪 إكسير يومي مجاني' : '🧪 Free daily elixir',
                isRTL ? '👥 5 رفاق' : '👥 5 companions',
                isRTL ? '🛒 خصم 20% المتجر' : '🛒 20% shop discount',
                isRTL ? '🎮 ألعاب غير محدودة' : '🎮 Unlimited minigames',
                isRTL ? '💾 نسخ احتياطي تلقائي' : '💾 Auto backup',
                isRTL ? '💎 شارة Premium' : '💎 Premium badge',
              ].map((f, i) => (
                <Text key={i} style={[styles.premiumFeature, { textAlign: isRTL ? 'right' : 'left' }]}>{f}</Text>
              ))}
              <NeonButton
                title={`${t('monthly')}: $4.99`}
                onPress={() => Alert.alert('Premium', isRTL ? 'قريباً!' : 'Coming soon!')}
                color={colors.dark.premiumGold}
                style={styles.premiumBtn}
              />
              <NeonButton
                title={`${t('yearly')}: $49.99`}
                onPress={() => Alert.alert('Premium', isRTL ? 'قريباً!' : 'Coming soon!')}
                color={colors.dark.premiumGold}
                variant="outline"
                style={styles.premiumBtn}
              />
            </GlowCard>
            <GlowCard style={styles.compareTable}>
              <Text style={[styles.compareTitle, { textAlign: 'center' }]}>
                {isRTL ? 'Free vs Premium' : 'Free vs Premium'}
              </Text>
              {[
                [isRTL ? 'المهام اليومية' : 'Daily Quests', '✅', '✅'],
                [isRTL ? 'الإحصائيات' : 'Stats', '✅', '✅'],
                [isRTL ? 'الرفاق' : 'Companions', isRTL ? '1' : '1', isRTL ? '5' : '5'],
                [isRTL ? 'ألعاب مصغرة' : 'Minigames', isRTL ? '2/يوم' : '2/day', '∞'],
                [isRTL ? 'إعلانات' : 'Ads', '❌', '✅'],
              ].map(([feat, free, prem], i) => (
                <View key={i} style={styles.compareRow}>
                  <Text style={styles.compareFeature}>{feat}</Text>
                  <Text style={styles.compareFree}>{free}</Text>
                  <Text style={[styles.comparePrem, { color: colors.dark.premiumGold }]}>{prem}</Text>
                </View>
              ))}
            </GlowCard>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 8 },
  backBtn: { color: colors.dark.primary, fontFamily: 'Cairo_600SemiBold', fontSize: 14 },
  title: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 18 },
  goldBal: { color: colors.dark.gold, fontFamily: 'Cairo_700Bold', fontSize: 14 },
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
  tabText: { color: colors.dark.textSecondary, fontFamily: 'Cairo_600SemiBold', fontSize: 12 },
  activeTabText: { color: '#000' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingTop: 8 },
  sectionNote: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 13, marginBottom: 12 },
  itemCard: { marginBottom: 10, padding: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemIcon: { fontSize: 28 },
  itemInfo: { flex: 1 },
  itemName: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 14 },
  itemDesc: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 12, marginTop: 2 },
  itemBuy: { alignItems: 'center', gap: 4 },
  itemPrice: { color: colors.dark.gold, fontFamily: 'Cairo_700Bold', fontSize: 13 },
  buyBtn: {
    backgroundColor: colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  buyBtnDisabled: { backgroundColor: colors.dark.cardBorder },
  buyBtnText: { color: '#000', fontFamily: 'Cairo_700Bold', fontSize: 12 },
  realPrice: { color: colors.dark.premiumGold, fontFamily: 'Cairo_700Bold', fontSize: 13 },
  buyBtnReal: {
    backgroundColor: colors.dark.premiumGold,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  buyBtnRealText: { color: '#000', fontFamily: 'Cairo_700Bold', fontSize: 12 },
  premiumCard: { marginBottom: 16, gap: 8 },
  premiumTitle: { color: colors.dark.premiumGold, fontFamily: 'Cairo_700Bold', fontSize: 22, marginBottom: 4 },
  premiumSubtitle: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 14, marginBottom: 8 },
  premiumFeature: { color: colors.dark.text, fontFamily: 'Cairo_400Regular', fontSize: 15 },
  premiumBtn: { width: '100%', marginTop: 8 },
  compareTable: { marginBottom: 16 },
  compareTitle: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 15, marginBottom: 12 },
  compareRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.dark.cardBorder },
  compareFeature: { flex: 1, color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 13 },
  compareFree: { width: 50, color: colors.dark.textSecondary, fontFamily: 'Cairo_600SemiBold', fontSize: 13, textAlign: 'center' },
  comparePrem: { width: 50, fontFamily: 'Cairo_700Bold', fontSize: 13, textAlign: 'center' },
});
