import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, type ViewStyle } from 'react-native';
import colors from '@/constants/colors';

interface NeonButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function NeonButton({ title, onPress, color, style, disabled, loading, variant = 'filled', size = 'md' }: NeonButtonProps) {
  const c = color || colors.dark.primary;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.base,
        styles[size],
        variant === 'filled' && { backgroundColor: c },
        variant === 'outline' && { borderWidth: 1, borderColor: c, backgroundColor: 'transparent' },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'filled' ? '#000' : c} size="small" />
      ) : (
        <Text style={[styles.text, { color: variant === 'filled' ? '#000' : c }, styles[`text_${size}`]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: colors.radius,
  },
  sm: { paddingVertical: 8, paddingHorizontal: 16 },
  md: { paddingVertical: 14, paddingHorizontal: 24 },
  lg: { paddingVertical: 18, paddingHorizontal: 32 },
  text: { fontFamily: 'Cairo_700Bold', fontWeight: '700' },
  text_sm: { fontSize: 13 },
  text_md: { fontSize: 16 },
  text_lg: { fontSize: 18 },
  disabled: { opacity: 0.4 },
});
