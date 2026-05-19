import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useGame } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { NeonButton } from '@/components/ui/NeonButton';
import colors from '@/constants/colors';

type Phase = 'intro' | 'playing' | 'dead';

const LANE_COUNT = 3;
const LANE_WIDTH = 90;

export default function VoidRunScreen() {
  const { addXP, addGold } = useGame();
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : insets.top;

  const [phase, setPhase] = useState<Phase>('intro');
  const [lane, setLane] = useState(1);
  const [distance, setDistance] = useState(0);
  const [obstacles, setObstacles] = useState<{ lane: number; y: number; id: number }[]>([]);
  const [isJumping, setIsJumping] = useState(false);

  const playerY = useSharedValue(0);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const obstacleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const distanceRef = useRef(0);
  const laneRef = useRef(1);
  const jumpRef = useRef(false);

  const playerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: playerY.value }],
  }));

  const cleanup = () => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (obstacleTimerRef.current) clearInterval(obstacleTimerRef.current);
  };

  useEffect(() => () => cleanup(), []);

  const startGame = () => {
    setPhase('playing');
    setLane(1);
    setDistance(0);
    setObstacles([]);
    setIsJumping(false);
    distanceRef.current = 0;
    laneRef.current = 1;
    jumpRef.current = false;

    gameLoopRef.current = setInterval(() => {
      distanceRef.current++;
      setDistance(distanceRef.current);
      setObstacles((obs) => {
        const moved = obs.map((o) => ({ ...o, y: o.y + 8 })).filter((o) => o.y < 500);
        const collision = moved.some((o) => o.y > 350 && o.y < 420 && o.lane === laneRef.current && !jumpRef.current);
        if (collision) {
          cleanup();
          const earned = Math.floor(distanceRef.current / 10);
          addXP(earned);
          addGold(earned * 2);
          setPhase('dead');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        return moved;
      });
    }, 50);

    obstacleTimerRef.current = setInterval(() => {
      const randomLane = Math.floor(Math.random() * LANE_COUNT);
      setObstacles((obs) => [...obs, { lane: randomLane, y: 0, id: Date.now() }]);
    }, 1500);
  };

  const moveLeft = () => {
    const next = Math.max(0, laneRef.current - 1);
    laneRef.current = next;
    setLane(next);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const moveRight = () => {
    const next = Math.min(LANE_COUNT - 1, laneRef.current + 1);
    laneRef.current = next;
    setLane(next);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const jump = () => {
    if (jumpRef.current) return;
    jumpRef.current = true;
    setIsJumping(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    playerY.value = withSpring(-80, { damping: 10 }, () => {
      playerY.value = withSpring(0, { damping: 12 }, () => {
        jumpRef.current = false;
        setIsJumping(false);
      });
    });
  };

  const GAME_WIDTH = LANE_COUNT * LANE_WIDTH;
  const playerX = lane * LANE_WIDTH + LANE_WIDTH / 2 - 20;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { cleanup(); router.back(); }}>
          <Text style={styles.back}>← {language === 'ar' ? 'رجوع' : 'Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🏃 {language === 'ar' ? 'هروب الفراغ' : 'Void Run'}</Text>
        <View style={{ width: 60 }} />
      </View>

      {phase === 'intro' && (
        <View style={styles.center}>
          <Text style={styles.introIcon}>🏃</Text>
          <Text style={styles.introTitle}>{language === 'ar' ? 'هروب الفراغ' : 'Void Run'}</Text>
          <Text style={styles.introDesc}>
            {language === 'ar'
              ? 'تفادى العقبات! تحرك يميناً ويساراً أو اقفز\nكلما طالت المسافة = ذهب أكثر'
              : 'Dodge obstacles! Move left/right or jump\nThe farther you go = more gold'}
          </Text>
          <NeonButton title={language === 'ar' ? '🏃 ابدأ الجري' : '🏃 Start Running'} onPress={startGame} style={styles.startBtn} size="lg" />
        </View>
      )}

      {phase === 'playing' && (
        <View style={styles.gameArea}>
          <Text style={styles.distanceText}>
            {language === 'ar' ? 'المسافة: ' : 'Distance: '}{distance}m
          </Text>
          <View style={[styles.track, { width: GAME_WIDTH }]}>
            {obstacles.map((obs) => (
              <View
                key={obs.id}
                style={[styles.obstacle, { left: obs.lane * LANE_WIDTH + 10, top: obs.y }]}
              >
                <Text style={{ fontSize: 32 }}>🪨</Text>
              </View>
            ))}
            <Animated.View style={[styles.player, { left: playerX }, playerStyle]}>
              <Text style={{ fontSize: 32 }}>{isJumping ? '🦸' : '🏃'}</Text>
            </Animated.View>
          </View>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.ctrlBtn} onPress={moveLeft} activeOpacity={0.7}>
              <Text style={styles.ctrlText}>◀</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.ctrlBtn, styles.jumpBtn]} onPress={jump} activeOpacity={0.7}>
              <Text style={styles.ctrlText}>{language === 'ar' ? 'قفز' : 'JUMP'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ctrlBtn} onPress={moveRight} activeOpacity={0.7}>
              <Text style={styles.ctrlText}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {phase === 'dead' && (
        <View style={styles.center}>
          <Text style={styles.introIcon}>💥</Text>
          <Text style={styles.resultTitle}>{language === 'ar' ? 'انتهت اللعبة!' : 'Game Over!'}</Text>
          <Text style={styles.distanceResult}>
            {language === 'ar' ? `${distance}m — رائع!` : `${distance}m — Great run!`}
          </Text>
          <Text style={styles.rewardText}>
            +{Math.floor(distance / 10)} XP  +{Math.floor(distance / 5)} 🪙
          </Text>
          <View style={styles.resultBtns}>
            <NeonButton title={language === 'ar' ? 'العب مجدداً' : 'Play Again'} onPress={startGame} style={styles.btn} />
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
  introTitle: { color: colors.dark.green, fontFamily: 'Cairo_700Bold', fontSize: 28, marginBottom: 16 },
  introDesc: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 15, textAlign: 'center', marginBottom: 40, lineHeight: 26 },
  startBtn: { width: '100%' },
  gameArea: { flex: 1, alignItems: 'center', paddingTop: 8 },
  distanceText: { color: colors.dark.green, fontFamily: 'Cairo_700Bold', fontSize: 22, marginBottom: 12 },
  track: {
    height: 420,
    backgroundColor: colors.dark.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark.cardBorder,
    overflow: 'hidden',
    position: 'relative',
  },
  obstacle: { position: 'absolute' },
  player: { position: 'absolute', bottom: 20 },
  controls: { flexDirection: 'row', gap: 16, marginTop: 24 },
  ctrlBtn: {
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.cardBorder,
    borderRadius: 12,
    width: 80,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jumpBtn: { backgroundColor: colors.dark.primary + '22', borderColor: colors.dark.primary, width: 100 },
  ctrlText: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold', fontSize: 18 },
  resultTitle: { color: colors.dark.red, fontFamily: 'Cairo_700Bold', fontSize: 32, marginBottom: 16 },
  distanceResult: { color: colors.dark.text, fontFamily: 'Cairo_600SemiBold', fontSize: 18, marginBottom: 8 },
  rewardText: { color: colors.dark.gold, fontFamily: 'Cairo_700Bold', fontSize: 16, marginBottom: 32 },
  resultBtns: { gap: 12, width: '100%' },
  btn: { width: '100%' },
});
