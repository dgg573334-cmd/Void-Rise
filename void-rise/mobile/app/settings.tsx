import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useGame } from '@/context/GameContext';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import colors from '@/constants/colors';

export default function SettingsScreen() {
  const { logout } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const { state } = useGame();
  const insets = useSafeAreaInsets();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const isRTL = language === 'ar';
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : insets.top;

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      isRTL ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ],
    );
  };

  const SettingRow = ({
    icon,
    label,
    right,
    onPress,
  }: {
    icon: string;
    label: string;
    right?: React.ReactNode;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.settingRow, isRTL && { flexDirection: 'row-reverse' }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={styles.settingIcon}>{icon}</Text>
      <Text style={[styles.settingLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>
      {right}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← {language === 'ar' ? 'رجوع' : 'Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>⚙️ {t('settings')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: isWeb ? 50 : insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Account */}
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? '👤 الحساب' : '👤 Account'}
        </Text>
        <GlowCard style={styles.section}>
          <SettingRow icon="📊" label={isRTL ? `المستوى ${state.level}` : `Level ${state.level}`} />
          <SettingRow icon="🔥" label={isRTL ? `خط النار: ${state.streak} يوم` : `Streak: ${state.streak} days`} />
          <SettingRow icon="🪙" label={isRTL ? `الذهب: ${state.gold.toLocaleString()}` : `Gold: ${state.gold.toLocaleString()}`} />
        </GlowCard>

        {/* Language */}
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? '🌍 اللغة' : '🌍 Language'}
        </Text>
        <GlowCard style={styles.section}>
          <SettingRow
            icon="🌐"
            label={language === 'ar' ? 'العربية / English' : 'Arabic / English'}
            right={
              <TouchableOpacity style={styles.langToggle} onPress={toggleLanguage}>
                <Text style={styles.langToggleText}>{language === 'ar' ? '→ EN' : '→ AR'}</Text>
              </TouchableOpacity>
            }
            onPress={toggleLanguage}
          />
        </GlowCard>

        {/* Notifications */}
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? '🔔 الإشعارات' : '🔔 Notifications'}
        </Text>
        <GlowCard style={styles.section}>
          <SettingRow
            icon="📱"
            label={isRTL ? 'إشعارات المهام' : 'Quest Notifications'}
            right={
              <Switch
                value={notifEnabled}
                onValueChange={setNotifEnabled}
                trackColor={{ false: colors.dark.cardBorder, true: colors.dark.primary }}
                thumbColor={notifEnabled ? colors.dark.primary : colors.dark.textSecondary}
              />
            }
          />
        </GlowCard>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? '⚡ إجراءات سريعة' : '⚡ Quick Actions'}
        </Text>
        <GlowCard style={styles.section}>
          <SettingRow
            icon="🏆"
            label={t('rankings')}
            right={<Text style={styles.chevron}>›</Text>}
            onPress={() => router.push('/rankings')}
          />
          <SettingRow
            icon="🛒"
            label={t('shop')}
            right={<Text style={styles.chevron}>›</Text>}
            onPress={() => router.push('/shop')}
          />
        </GlowCard>

        {/* About */}
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('about')}
        </Text>
        <GlowCard style={styles.section}>
          <SettingRow icon="📱" label={isRTL ? 'VOID RISE — الإصدار 1.0' : 'VOID RISE — Version 1.0'} />
          <SettingRow icon="👤" label={isRTL ? 'المطور: Void' : 'Developer: Void'} />
          <SettingRow icon="🌌" label={isRTL ? 'انهض من الفراغ' : 'Rise from the Void'} />
        </GlowCard>

        {/* Logout */}
        <NeonButton
          title={t('logout')}
          onPress={handleLogout}
          color={colors.dark.red}
          variant="outline"
          style={styles.logoutBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 8 },
  backBtn: { color: colors.dark.primary, fontFamily: 'Cairo_600SemiBold', fontSize: 14, width: 60 },
  title: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 20 },
  scroll: { flex: 1 },
  content: { padding: 16 },
  sectionTitle: { color: colors.dark.textSecondary, fontFamily: 'Cairo_600SemiBold', fontSize: 13, marginBottom: 8, marginTop: 4 },
  section: { marginBottom: 16, padding: 4 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.cardBorder,
  },
  settingIcon: { fontSize: 20 },
  settingLabel: { flex: 1, color: colors.dark.text, fontFamily: 'Cairo_400Regular', fontSize: 15 },
  chevron: { color: colors.dark.textSecondary, fontSize: 20 },
  langToggle: {
    backgroundColor: colors.dark.primary + '22',
    borderWidth: 1,
    borderColor: colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  langToggleText: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold', fontSize: 13 },
  logoutBtn: { marginTop: 8 },
});
