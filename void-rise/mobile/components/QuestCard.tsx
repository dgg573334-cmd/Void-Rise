import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '@/constants/colors';
import { GlowCard } from '@/components/ui/GlowCard';

interface QuestCardProps {
  icon: string;
  name: string;
  desc: string;
  progress: number;
  target: number;
  unit: string;
  xpReward: number;
  goldReward: number;
  completed: boolean;
  language: 'ar' | 'en';
}

export function QuestCard({ icon, name, desc, progress, target, unit, xpReward, goldReward, completed, language }: QuestCardProps) {
  const pct = Math.min(progress / target, 1);

  return (
    <GlowCard
      style={[styles.card, completed && styles.completedCard]}
      glowColor={completed ? colors.dark.green : colors.dark.cardBorder}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.info}>
          <Text style={[styles.name, { textAlign: language === 'ar' ? 'right' : 'left' }]}>{name}</Text>
          <Text style={[styles.desc, { textAlign: language === 'ar' ? 'right' : 'left' }]}>{desc}</Text>
        </View>
        {completed && <Text style={styles.checkmark}>✅</Text>}
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: completed ? colors.dark.green : colors.dark.primary }]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.progress}>
          {progress.toLocaleString()} / {target.toLocaleString()} {unit}
        </Text>
        <View style={styles.rewards}>
          <Text style={styles.xp}>+{xpReward} XP</Text>
          <Text style={styles.gold}>🪙 {goldReward}</Text>
        </View>
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  completedCard: { opacity: 0.8 },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  icon: { fontSize: 28, marginRight: 12 },
  info: { flex: 1 },
  name: { color: colors.dark.text, fontFamily: 'Cairo_700Bold', fontSize: 15, marginBottom: 2 },
  desc: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 13 },
  checkmark: { fontSize: 20 },
  track: {
    height: 6,
    backgroundColor: colors.dark.cardBorder,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  fill: { height: '100%', borderRadius: 3 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progress: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 12 },
  rewards: { flexDirection: 'row', gap: 12 },
  xp: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold', fontSize: 12 },
  gold: { color: colors.dark.gold, fontFamily: 'Cairo_700Bold', fontSize: 12 },
});
