import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { NeonButton } from '@/components/ui/NeonButton';
import colors from '@/constants/colors';

export default function LoginScreen() {
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const isRTL = language === 'ar';

  const handleLogin = async () => {
    if (!email.trim()) return;
    setLoading(true);
    await login(email.trim().split('@')[0] || 'Void Hunter', email.trim());
    setLoading(false);
    router.replace('/(auth)/onboarding');
  };

  const handleGoogle = async () => {
    setLoading(true);
    await login('Void Hunter', 'void@gmail.com');
    setLoading(false);
    router.replace('/(auth)/onboarding');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoV}>V</Text>
            <Text style={styles.logoR}>R</Text>
          </View>
          <Text style={styles.appName}>VOID RISE</Text>
          <Text style={styles.tagline}>{t('tagline')}</Text>
          <Text style={styles.taglineEn}>Rise from the Void</Text>
        </View>

        {/* Google Button */}
        <TouchableOpacity onPress={handleGoogle} style={styles.googleBtn} activeOpacity={0.8}>
          <Text style={styles.googleIcon}>🅶</Text>
          <Text style={styles.googleText}>{t('loginGoogle')}</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{language === 'ar' ? 'أو' : 'or'}</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Email Login */}
        <TextInput
          style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
          placeholder={t('email')}
          placeholderTextColor={colors.dark.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
        />
        <TextInput
          style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
          placeholder={t('password')}
          placeholderTextColor={colors.dark.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
        />

        <NeonButton
          title={t('login')}
          onPress={handleLogin}
          loading={loading}
          style={styles.loginBtn}
        />

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>{t('noAccount')} </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.registerLink}>{t('register')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Void © 2025</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  scroll: { flexGrow: 1, padding: 24 },
  logoSection: { alignItems: 'center', marginBottom: 48 },
  logoBadge: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.dark.primary,
    borderRadius: 50,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.backgroundSecondary,
  },
  logoV: { color: colors.dark.white, fontFamily: 'Cairo_700Bold', fontSize: 36 },
  logoR: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold', fontSize: 36 },
  appName: { color: colors.dark.white, fontFamily: 'Cairo_700Bold', fontSize: 32, letterSpacing: 4 },
  tagline: { color: colors.dark.primary, fontFamily: 'Cairo_600SemiBold', fontSize: 16, marginTop: 4 },
  taglineEn: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 13, marginTop: 2 },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.cardBorder,
    borderRadius: colors.radius,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  googleIcon: { fontSize: 22 },
  googleText: { color: colors.dark.text, fontFamily: 'Cairo_600SemiBold', fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.dark.cardBorder },
  dividerText: { color: colors.dark.textSecondary, marginHorizontal: 12, fontFamily: 'Cairo_400Regular' },
  input: {
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.cardBorder,
    borderRadius: colors.radius,
    padding: 14,
    color: colors.dark.text,
    fontFamily: 'Cairo_400Regular',
    fontSize: 15,
    marginBottom: 12,
  },
  loginBtn: { width: '100%', marginBottom: 16 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32 },
  registerText: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular' },
  registerLink: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold' },
  footer: { color: colors.dark.textMuted, textAlign: 'center', fontFamily: 'Cairo_400Regular', fontSize: 12 },
});
