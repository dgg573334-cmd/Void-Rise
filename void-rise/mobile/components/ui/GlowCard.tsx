import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import colors from '@/constants/colors';

interface GlowCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  noBorder?: boolean;
}

export function GlowCard({ children, style, glowColor, noBorder }: GlowCardProps) {
  return (
    <View
      style={[
        styles.card,
        !noBorder && {
          borderColor: glowColor || colors.dark.cardBorder,
          borderWidth: 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.dark.card,
    borderRadius: colors.radius,
    padding: 16,
  },
});
