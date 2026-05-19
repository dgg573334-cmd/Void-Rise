import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { NeonButton } from '@/components/ui/NeonButton';
import colors from '@/constants/colors';

type Phase = 'intro' | 'playing' | 'win' | 'lose';

const BOSSES = [
  { name: 'كسل العملاق', nameEn: 'Laziness Giant', icon: '😴', maxHp: 30 },
  { name: 'مماطلة الظلام', nameEn: 'Dark Procrastination', icon: '⏰', maxHp: 25 },
  { name: 'هاتف الإدمان', nameEn: 'Addiction Phone', icon: '📱', maxHp: 35 },
];

export default function BossFightScreen() {
  const { addXP, addGold } = useGame();
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const isRTL = language === 'ar';
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : insets.top;

  const [phase, setPhase] = useState<Phase>('intro');
  const [boss] = useState(() => BOSSES[Math.floor(Math.random() * BOSSES.length)]);
  const [bossHp, setBossHp] = useState(boss.maxHp);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const bossScale = useSharedValue(1);
  const screenShake = useSharedValue(0);

  const bossStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bossScale.value }, { translateX: screenShake.value }],
  }));

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startGame = () => {
    setPhase('playing');
    setBossHp(boss.maxHp);
    setScore(0);
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase('lose');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleTap = () => {
    if (phase !== 'playing') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    bossScale.value = withSequence(withSpring(0.85), withSpring(1.0));
    screenShake.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
    setScore((s) => s + 1);
    setBossHp((hp) => {
      const newHp = hp - 1;
      if (newHp <= 0) {
        clearInterval(timerRef.current!);
        setPhase('win');
        addXP(80);
        addGold(150);
        return 0;
      }
      return newHp;
    });
  };

  const hpPct = (bossHp / boss.maxHp) * 100;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← {language === 'ar' ? 'رجوع' : 'Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>⚔️ {language === 'ar' ? 'معركة زعيم' : 'Boss Fight'}</Text>
        <View style={{ width: 60 }} />
      </View>

      {phase === 'intro' && (
        <View style={styles.center}>
          <Text style={styles.bossIntroIcon}>{boss.icon}</Text>
          <Text style={styles.bossName}>{language === 'ar' ? boss.name : boss.nameEn}</Text>
          <Text style={styles.introDesc}>
            {language === 'ar'
              ? 'اضغط بسرعة لتوجيه الضربات! 30 ثانية للفوز'
              : 'Tap fast to attack! 30 seconds to win'}
          </Text>
          <NeonButton title={language === 'ar' ? '⚔️ ابدأ المعركة' : '⚔️ Start Battle'} onPress={startGame} style={styles.startBtn} size="lg" />
        </View>
      )}

      {phase === 'playing' && (
        <View style={styles.playArea}>
          <View style={styles.timerRow}>
            <Text style={styles.timer}>{timeLeft}s</Text>
            <Text style={styles.scoreText}>{language === 'ar' ? 'ضربات: ' : 'Hits: '}{score}</Text>
          </View>
          <View style={styles.hpBar}>
            <View style={[styles.hpFill, { width: `${hpPct}%` }]} />
          </View>
          <Text style={styles.hpText}>{bossHp} / {boss.maxHp} HP</Text>
          <TouchableOpacity onPress={handleTap} activeOpacity={0.8} style={styles.bossTapArea}>
            <Animated.Text style={[styles.bossIcon, bossStyle]}>{boss.icon}</Animated.Text>
            <Text style={styles.tapHint}>{language === 'ar' ? '⚡ اضغط!' : '⚡ TAP!'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {(phase === 'win' || phase === 'lose') && (
        <View style={styles.center}>
          <Text style={styles.resultIcon}>{phase === 'win' ? '🏆' : '💀'}</Text>
          <Text style={[styles.resultTitle, { color: phase === 'win' ? colors.dark.green : colors.dark.red }]}>
            {phase === 'win' ? (language === 'ar' ? '🎉 انتصرت!' : '🎉 Victory!') : (language === 'ar' ? '💀 خسرت!' : '💀 Defeated!')}
          </Text>
          {phase === 'win' && (
            <Text style={styles.rewardText}>+80 XP  +150 🪙</Text>
          )}
          <View style={styles.resultBtns}>
            <NeonButton title={language === 'ar' ? 'العب مجدداً' : 'Play Again'} onPress={startGame} style={styles.resultBtn} />
            <NeonButton title={language === 'ar' ? 'رجوع' : 'Back'} onPress={() => router.back()} variant="outline" style={styles.resultBtn} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  back: { color: colors.dark.primary, fontFamily: 'Cairo_600SemiBold', fontSize: 14, width: 60 },
  title: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 18 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  bossIntroIcon: { fontSize: 96, marginBottom: 24 },
  bossName: { color: colors.dark.red, fontFamily: 'Cairo_700Bold', fontSize: 28, marginBottom: 16, textAlign: 'center' },
  introDesc: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 16, textAlign: 'center', marginBottom: 40, lineHeight: 26 },
  startBtn: { width: '100%' },
  playArea: { flex: 1, padding: 24, alignItems: 'center' },
  timerRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16 },
  timer: { color: colors.dark.red, fontFamily: 'Cairo_700Bold', fontSize: 32 },
  scoreText: { color: colors.dark.gold, fontFamily: 'Cairo_700Bold', fontSize: 22 },
  hpBar: {
    width: '100%',
    height: 14,
    backgroundColor: colors.dark.cardBorder,
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 6,
  },
  hpFill: { height: '100%', backgroundColor: colors.dark.red, borderRadius: 7 },
  hpText: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 12, marginBottom: 32 },
  bossTapArea: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  bossIcon: { fontSize: 120 },
  tapHint: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold', fontSize: 22, marginTop: 16 },
  resultIcon: { fontSize: 80, marginBottom: 24 },
  resultTitle: { fontFamily: 'Cairo_700Bold', fontSize: 32, marginBottom: 16 },
  rewardText: { color: colors.dark.gold, fontFamily: 'Cairo_700Bold', fontSize: 18, marginBottom: 32 },
  resultBtns: { gap: 12, width: '100%' },
  resultBtn: { width: '100%' },
});
