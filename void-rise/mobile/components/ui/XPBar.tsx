import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import colors from '@/constants/colors';

interface XPBarProps {
  xp: number;
  xpToNext: number;
  level: number;
}

export function XPBar({ xp, xpToNext, level }: XPBarProps) {
  const progress = Math.min(xp / xpToNext, 1);
  const width = useSharedValue(progress);

  React.useEffect(() => {
    width.value = withTiming(progress, { duration: 800 });
  }, [progress, width]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.levelText}>LV {level}</Text>
        <Text style={styles.xpText}>
          {xp.toLocaleString()} / {xpToNext.toLocaleString()} XP
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  levelText: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold', fontSize: 14 },
  xpText: { color: colors.dark.textSecondary, fontSize: 12, fontFamily: 'Cairo_400Regular' },
  track: {
    height: 8,
    backgroundColor: colors.dark.cardBorder,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.dark.primary,
    borderRadius: 4,
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});
