import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import colors from '@/constants/colors';
import { NeonButton } from '@/components/ui/NeonButton';

interface PenaltyOverlayProps {
  visible: boolean;
  onDismiss: () => void;
  language: 'ar' | 'en';
}

export function PenaltyOverlay({ visible, onDismiss, language }: PenaltyOverlayProps) {
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      pulseOpacity.value = withRepeat(
        withSequence(withTiming(0.4, { duration: 600 }), withTiming(1, { duration: 600 })),
        -1,
        false,
      );
    }
  }, [visible, pulseOpacity]);

  const bgStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.redBg, bgStyle]} />
        <View style={styles.content}>
          <Text style={styles.skull}>💀</Text>
          <Text style={styles.warning}>
            {language === 'ar' ? '⚠️ VOID RISE: فشلت في مهامك' : '⚠️ VOID RISE: Quest Failed'}
          </Text>
          <Text style={styles.title}>
            {language === 'ar' ? 'العقوبة مفروضة' : 'Penalty Enforced'}
          </Text>
          <Text style={styles.task}>
            {language === 'ar'
              ? 'أكمل 100 قرفصاء أو 3 كم مشي لرفع الحظر'
              : 'Complete 100 squats or 3km walk to lift the ban'}
          </Text>
          <View style={styles.locked}>
            <Text style={styles.lockedText}>
              {language === 'ar' ? '🔒 المتجر • التصنيفات • الرفاق' : '🔒 Shop • Rankings • Companions'}
            </Text>
          </View>
          <NeonButton
            title={language === 'ar' ? 'إكمال العقوبة' : 'Complete Penalty'}
            onPress={onDismiss}
            color={colors.dark.red}
            style={styles.btn}
          />
          <NeonButton
            title={language === 'ar' ? 'تجاهل (خصم 10% XP)' : 'Ignore (-10% XP penalty)'}
            onPress={onDismiss}
            variant="ghost"
            style={styles.ignoreBtn}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.95)' },
  redBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.dark.red,
    opacity: 0.15,
  },
  content: { padding: 32, alignItems: 'center', width: '90%' },
  skull: { fontSize: 64, marginBottom: 16 },
  warning: { color: colors.dark.red, fontFamily: 'Cairo_700Bold', fontSize: 16, textAlign: 'center', marginBottom: 8 },
  title: { color: colors.dark.white, fontFamily: 'Cairo_700Bold', fontSize: 28, textAlign: 'center', marginBottom: 16 },
  task: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 15, textAlign: 'center', marginBottom: 24 },
  locked: {
    backgroundColor: colors.dark.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
    width: '100%',
  },
  lockedText: { color: colors.dark.red, fontFamily: 'Cairo_600SemiBold', fontSize: 14, textAlign: 'center' },
  btn: { width: '100%', marginBottom: 12 },
  ignoreBtn: { width: '100%' },
});
