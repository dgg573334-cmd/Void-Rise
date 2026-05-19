import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import colors from '@/constants/colors';
import { NeonButton } from '@/components/ui/NeonButton';

interface LevelUpModalProps {
  visible: boolean;
  level: number;
  onDismiss: () => void;
  language: 'ar' | 'en';
}

export function LevelUpModal({ visible, level, onDismiss, language }: LevelUpModalProps) {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      scale.value = withSequence(withSpring(1.1), withSpring(1.0));
      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [visible, opacity, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, animStyle]}>
          <Text style={styles.title}>{language === 'ar' ? '🎉 ترقية المستوى!' : '🎉 Level Up!'}</Text>
          <Text style={styles.level}>
            {language === 'ar' ? 'المستوى' : 'Level'} {level}
          </Text>
          <Text style={styles.reward}>
            {language === 'ar' ? '+3 نقاط إحصائيات' : '+3 Stat Points'}
          </Text>
          <NeonButton
            title={language === 'ar' ? 'متابعة' : 'Continue'}
            onPress={onDismiss}
            style={styles.btn}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.dark.card,
    borderWidth: 2,
    borderColor: colors.dark.primary,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '80%',
  },
  title: { fontSize: 24, color: colors.dark.primary, fontFamily: 'Cairo_700Bold', marginBottom: 12 },
  level: { fontSize: 56, color: colors.dark.gold, fontFamily: 'Cairo_700Bold', marginBottom: 8 },
  reward: { fontSize: 16, color: colors.dark.green, fontFamily: 'Cairo_600SemiBold', marginBottom: 24 },
  btn: { width: '100%' },
});
