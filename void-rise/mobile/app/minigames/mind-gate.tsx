import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import colors from '@/constants/colors';
import { MIND_GATE_QUESTIONS } from '@/constants/gameData';

type Phase = 'intro' | 'quiz' | 'result';

export default function MindGateScreen() {
  const { addXP, addGold } = useGame();
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : insets.top;

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const questions = MIND_GATE_QUESTIONS;
  const q = questions[currentQ];
  const passed = score >= 7;

  const startQuiz = () => {
    setPhase('quiz');
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === q.correct;
    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScore((s) => s + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((c) => c + 1);
        setSelected(null);
        setAnswered(false);
      } else {
        const finalScore = correct ? score + 1 : score;
        if (finalScore >= 7) {
          addXP(120);
          addGold(200);
        }
        setPhase('result');
      }
    }, 1200);
  };

  const optionColor = (idx: number) => {
    if (!answered) return colors.dark.cardBorder;
    if (idx === q.correct) return colors.dark.green;
    if (idx === selected && idx !== q.correct) return colors.dark.red;
    return colors.dark.cardBorder;
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← {language === 'ar' ? 'رجوع' : 'Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🧠 {language === 'ar' ? 'بوابة العقل' : 'Mind Gate'}</Text>
        <View style={{ width: 60 }} />
      </View>

      {phase === 'intro' && (
        <View style={styles.center}>
          <Text style={styles.introIcon}>🧠</Text>
          <Text style={styles.introTitle}>{language === 'ar' ? 'بوابة العقل' : 'Mind Gate'}</Text>
          <Text style={styles.introDesc}>
            {language === 'ar'
              ? '10 أسئلة في 10 مجالات مختلفة\n7/10 نجاح = مضاعف XP الذكاء'
              : '10 questions across different topics\n7/10 = Intelligence XP multiplier'}
          </Text>
          <NeonButton title={language === 'ar' ? '🧠 ابدأ الاختبار' : '🧠 Start Quiz'} onPress={startQuiz} style={styles.startBtn} size="lg" />
        </View>
      )}

      {phase === 'quiz' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.quizContent}>
          {/* Progress */}
          <View style={styles.progress}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${((currentQ) / questions.length) * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{currentQ + 1} / {questions.length}</Text>
          </View>

          <Text style={styles.scoreLabel}>
            {language === 'ar' ? 'النتيجة: ' : 'Score: '}{score}
          </Text>

          <GlowCard glowColor={colors.dark.purple} style={styles.questionCard}>
            <Text style={styles.questionText}>{q.question}</Text>
          </GlowCard>

          <View style={styles.options}>
            {q.options.map((opt, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.option, { borderColor: optionColor(idx) }]}
                onPress={() => handleAnswer(idx)}
                activeOpacity={0.8}
                disabled={answered}
              >
                <Text style={[styles.optionLetter, { color: optionColor(idx) }]}>
                  {['A', 'B', 'C', 'D'][idx]}
                </Text>
                <Text style={styles.optionText}>{opt}</Text>
                {answered && idx === q.correct && <Text style={styles.checkIcon}>✅</Text>}
                {answered && idx === selected && idx !== q.correct && <Text style={styles.checkIcon}>❌</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {phase === 'result' && (
        <View style={styles.center}>
          <Text style={styles.introIcon}>{passed ? '🎓' : '💔'}</Text>
          <Text style={[styles.resultTitle, { color: passed ? colors.dark.green : colors.dark.red }]}>
            {passed
              ? (language === 'ar' ? 'اجتزت البوابة!' : 'Gate Passed!')
              : (language === 'ar' ? 'فشلت في البوابة' : 'Gate Failed')}
          </Text>
          <Text style={styles.finalScore}>
            {score} / {questions.length}
          </Text>
          {passed && <Text style={styles.rewardText}>+120 XP  +200 🪙</Text>}
          <Text style={styles.passMark}>
            {language === 'ar' ? '(النجاح: 7/10)' : '(Pass: 7/10)'}
          </Text>
          <View style={styles.resultBtns}>
            <NeonButton title={language === 'ar' ? 'العب مجدداً' : 'Play Again'} onPress={startQuiz} style={styles.btn} />
            <NeonButton title={language === 'ar' ? 'رجوع' : 'Back'} onPress={() => router.back()} variant="outline" style={styles.btn} />
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
  introIcon: { fontSize: 80, marginBottom: 24 },
  introTitle: { color: colors.dark.purple, fontFamily: 'Cairo_700Bold', fontSize: 28, marginBottom: 16 },
  introDesc: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 15, textAlign: 'center', marginBottom: 40, lineHeight: 26 },
  startBtn: { width: '100%' },
  scroll: { flex: 1 },
  quizContent: { padding: 16, paddingBottom: 40 },
  progress: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  progressTrack: { flex: 1, height: 6, backgroundColor: colors.dark.cardBorder, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.dark.purple, borderRadius: 3 },
  progressText: { color: colors.dark.textSecondary, fontFamily: 'Cairo_600SemiBold', fontSize: 13 },
  scoreLabel: { color: colors.dark.gold, fontFamily: 'Cairo_700Bold', fontSize: 16, marginBottom: 12 },
  questionCard: { marginBottom: 20, padding: 20 },
  questionText: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 17, lineHeight: 28 },
  options: { gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderRadius: colors.radius,
    padding: 14,
    gap: 12,
  },
  optionLetter: { fontFamily: 'Cairo_700Bold', fontSize: 16, width: 24 },
  optionText: { flex: 1, color: colors.dark.text, fontFamily: 'Cairo_400Regular', fontSize: 15 },
  checkIcon: { fontSize: 18 },
  resultTitle: { fontFamily: 'Cairo_700Bold', fontSize: 28, marginBottom: 16 },
  finalScore: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 48, marginBottom: 12 },
  rewardText: { color: colors.dark.gold, fontFamily: 'Cairo_700Bold', fontSize: 18, marginBottom: 8 },
  passMark: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 14, marginBottom: 32 },
  resultBtns: { gap: 12, width: '100%' },
  btn: { width: '100%' },
});
