import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import colors from '@/constants/colors';
import type { ActivityLog } from '@/context/GameContext';

type ActivityType = ActivityLog['type'];

interface ActivityOption {
  type: ActivityType;
  iconEn: string;
  iconAr: string;
  labelEn: string;
  labelAr: string;
  unitEn: string;
  unitAr: string;
  placeholderEn: string;
  placeholderAr: string;
  color: string;
}

const ACTIVITIES: ActivityOption[] = [
  {
    type: 'exercises',
    iconEn: '💪',
    iconAr: '💪',
    labelEn: 'Exercises',
    labelAr: 'تمارين',
    unitEn: 'reps',
    unitAr: 'تكرار',
    placeholderEn: 'How many reps?',
    placeholderAr: 'كم تكراراً؟',
    color: colors.dark.crimson,
  },
  {
    type: 'steps',
    iconEn: '🏃',
    iconAr: '🏃',
    labelEn: 'Steps',
    labelAr: 'خطوات',
    unitEn: 'steps',
    unitAr: 'خطوة',
    placeholderEn: 'How many steps?',
    placeholderAr: 'كم خطوة؟',
    color: colors.dark.green,
  },
  {
    type: 'focus',
    iconEn: '🧠',
    iconAr: '🧠',
    labelEn: 'Focus',
    labelAr: 'تركيز',
    unitEn: 'minutes',
    unitAr: 'دقيقة',
    placeholderEn: 'Focus minutes?',
    placeholderAr: 'دقائق التركيز؟',
    color: colors.dark.purple,
  },
  {
    type: 'reading',
    iconEn: '📚',
    iconAr: '📚',
    labelEn: 'Reading',
    labelAr: 'قراءة',
    unitEn: 'minutes',
    unitAr: 'دقيقة',
    placeholderEn: 'Reading minutes?',
    placeholderAr: 'دقائق القراءة؟',
    color: colors.dark.diamond,
  },
];

export default function LogScreen() {
  const { logActivity, state } = useGame();
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<ActivityType>('exercises');
  const [amount, setAmount] = useState('');
  const [recentXP, setRecentXP] = useState<number | null>(null);
  const isRTL = language === 'ar';
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : insets.top;

  const selectedActivity = ACTIVITIES.find((a) => a.type === selected)!;

  const handleLog = () => {
    const val = parseInt(amount, 10);
    if (!val || val <= 0) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'أدخل رقماً صحيحاً' : 'Enter a valid number',
      );
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logActivity(selected, val);
    setAmount('');
    setRecentXP(val);
    setTimeout(() => setRecentXP(null), 3000);
  };

  const recentLogs = state.activityLog.slice(0, 5);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: 80 + (isWeb ? 34 : insets.bottom) }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.pageTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          📝 {t('logActivity')}
        </Text>

        {/* Activity Type Selector */}
        <View style={styles.typeGrid}>
          {ACTIVITIES.map((a) => (
            <TouchableOpacity
              key={a.type}
              style={[
                styles.typeBtn,
                selected === a.type && { backgroundColor: a.color + '33', borderColor: a.color },
              ]}
              onPress={() => setSelected(a.type)}
              activeOpacity={0.8}
            >
              <Text style={styles.typeIcon}>{a.iconEn}</Text>
              <Text style={[styles.typeLabel, selected === a.type && { color: a.color }]}>
                {language === 'ar' ? a.labelAr : a.labelEn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount Input */}
        <GlowCard glowColor={selectedActivity.color} style={styles.inputCard}>
          <Text style={[styles.inputLabel, { textAlign: isRTL ? 'right' : 'left', color: selectedActivity.color }]}>
            {selectedActivity.iconEn} {language === 'ar' ? selectedActivity.labelAr : selectedActivity.labelEn}
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { textAlign: isRTL ? 'right' : 'left', flex: 1 }]}
              placeholder={language === 'ar' ? selectedActivity.placeholderAr : selectedActivity.placeholderEn}
              placeholderTextColor={colors.dark.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <Text style={[styles.unit, { color: selectedActivity.color }]}>
              {language === 'ar' ? selectedActivity.unitAr : selectedActivity.unitEn}
            </Text>
          </View>
        </GlowCard>

        {recentXP !== null && (
          <GlowCard glowColor={colors.dark.green} style={styles.xpFlash}>
            <Text style={styles.xpFlashText}>✅ {language === 'ar' ? 'تم التسجيل!' : 'Logged!'} +XP +🪙</Text>
          </GlowCard>
        )}

        <NeonButton title={language === 'ar' ? '⚡ سجّل الآن' : '⚡ Log Now'} onPress={handleLog} style={styles.logBtn} size="lg" />

        {/* Grace Shield */}
        {!state.questProgress.graceUsed && (
          <GlowCard glowColor={colors.dark.purple} style={styles.graceCard}>
            <Text style={[styles.graceTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              🛡️ {t('graceDone')}
            </Text>
            <Text style={[styles.graceDesc, { textAlign: isRTL ? 'right' : 'left' }]}>
              {language === 'ar'
                ? 'اكتب 3 أشياء ممتن لها واحصل على حماية من عقوبة مهمة واحدة'
                : 'Write 3 gratitude notes for protection from one quest penalty'}
            </Text>
          </GlowCard>
        )}

        {/* Recent Activity */}
        {recentLogs.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {language === 'ar' ? '📋 النشاط الأخير' : '📋 Recent Activity'}
            </Text>
            {recentLogs.map((log) => {
              const act = ACTIVITIES.find((a) => a.type === log.type)!;
              return (
                <View key={log.id} style={[styles.logItem, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Text style={styles.logIcon}>{act.iconEn}</Text>
                  <View style={styles.logInfo}>
                    <Text style={[styles.logName, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {language === 'ar' ? act.labelAr : act.labelEn} — {log.amount} {language === 'ar' ? act.unitAr : act.unitEn}
                    </Text>
                    <Text style={[styles.logTime, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <View style={styles.logReward}>
                    <Text style={styles.logXP}>+{log.xpGained} XP</Text>
                    <Text style={styles.logGold}>+{log.goldGained} 🪙</Text>
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  scroll: { flex: 1 },
  content: { padding: 16 },
  pageTitle: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold', fontSize: 22, marginBottom: 20 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  typeBtn: {
    width: '47%',
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.cardBorder,
    borderRadius: colors.radius,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  typeIcon: { fontSize: 28 },
  typeLabel: { color: colors.dark.textSecondary, fontFamily: 'Cairo_600SemiBold', fontSize: 13 },
  inputCard: { marginBottom: 16 },
  inputLabel: { fontFamily: 'Cairo_700Bold', fontSize: 15, marginBottom: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  input: {
    backgroundColor: colors.dark.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    color: colors.dark.text,
    fontFamily: 'Cairo_400Regular',
    fontSize: 18,
  },
  unit: { fontFamily: 'Cairo_700Bold', fontSize: 14 },
  xpFlash: { marginBottom: 12 },
  xpFlashText: { color: colors.dark.green, fontFamily: 'Cairo_700Bold', fontSize: 14, textAlign: 'center' },
  logBtn: { width: '100%', marginBottom: 16 },
  graceCard: { marginBottom: 20 },
  graceTitle: { color: colors.dark.purple, fontFamily: 'Cairo_700Bold', fontSize: 15, marginBottom: 8 },
  graceDesc: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 13 },
  sectionTitle: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 16, marginBottom: 12 },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: colors.radius,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  logIcon: { fontSize: 24 },
  logInfo: { flex: 1 },
  logName: { color: colors.dark.text, fontFamily: 'Cairo_600SemiBold', fontSize: 14 },
  logTime: { color: colors.dark.textMuted, fontFamily: 'Cairo_400Regular', fontSize: 12 },
  logReward: { alignItems: 'flex-end' },
  logXP: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold', fontSize: 12 },
  logGold: { color: colors.dark.gold, fontFamily: 'Cairo_700Bold', fontSize: 12 },
});
