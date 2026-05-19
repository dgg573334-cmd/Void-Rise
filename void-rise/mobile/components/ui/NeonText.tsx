import React from 'react';
import { StyleSheet, Text, type TextStyle } from 'react-native';
import colors from '@/constants/colors';

interface NeonTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bold?: boolean;
  dim?: boolean;
}

export function NeonText({ children, style, color, size = 'md', bold, dim }: NeonTextProps) {
  const c = dim ? colors.dark.primaryDim : color || colors.dark.primary;
  return (
    <Text style={[styles.base, styles[size], bold && styles.bold, { color: c }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'Cairo_400Regular',
    color: colors.dark.primary,
  },
  sm: { fontSize: 12 },
  md: { fontSize: 16 },
  lg: { fontSize: 22 },
  xl: { fontSize: 32 },
  bold: { fontFamily: 'Cairo_700Bold', fontWeight: '700' },
});
