import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useGame } from '@/context/GameContext';
import { NeonButton } from '@/components/ui/NeonButton';
import colors from '@/constants/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  { icon: '⚔️', bg: '🌌' },
  { icon: '⚡', bg: '🔥' },
  { icon: '👑', bg: '💎' },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const { t, language } = useLanguage();
  const { state } = useGame();
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);
  const [name, setName] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const isRTL = language === 'ar';

  const titles = [
    { title: t('onboard1Title'), text: t('onboard1Text') },
    { title: t('onboard2Title'), text: t('onboard2Text') },
    { title: t('onboard3Title'), text: t('onboard3Text') },
  ];

  const goNext = () => {
    if (currentPage < 2) {
      flatListRef.current?.scrollToIndex({ index: currentPage + 1 });
      setCurrentPage(currentPage + 1);
    } else {
      handleStart();
    }
  };

  const handleStart = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.slideIcon}>{item.icon}</Text>
            <Text style={[styles.slideTitle, { textAlign: isRTL ? 'right' : 'center' }]}>
              {titles[index].title}
            </Text>
            <Text style={[styles.slideText, { textAlign: isRTL ? 'right' : 'center' }]}>
              {titles[index].text}
            </Text>
            {index === 2 && (
              <View style={styles.nameSection}>
                <Text style={[styles.nameLabel, { textAlign: isRTL ? 'right' : 'center' }]}>
                  {t('chooseName')}
                </Text>
                <TextInput
                  style={[styles.nameInput, { textAlign: isRTL ? 'right' : 'left' }]}
                  placeholder={t('enterName')}
                  placeholderTextColor={colors.dark.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}
          </View>
        )}
        keyExtractor={(_, i) => String(i)}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentPage && styles.activeDot]} />
          ))}
        </View>
        <NeonButton
          title={currentPage < 2 ? t('next') : t('start')}
          onPress={goNext}
          style={styles.btn}
          size="lg"
        />
        {currentPage < 2 && (
          <TouchableOpacity onPress={handleStart} style={styles.skipBtn}>
            <Text style={styles.skipText}>{language === 'ar' ? 'تخطي' : 'Skip'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  slideIcon: { fontSize: 80, marginBottom: 32 },
  slideTitle: { color: colors.dark.primary, fontFamily: 'Cairo_700Bold', fontSize: 28, marginBottom: 16 },
  slideText: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular', fontSize: 17, lineHeight: 28 },
  nameSection: { width: '100%', marginTop: 32 },
  nameLabel: { color: colors.dark.gold, fontFamily: 'Cairo_600SemiBold', fontSize: 16, marginBottom: 12 },
  nameInput: {
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.primary,
    borderRadius: colors.radius,
    padding: 14,
    color: colors.dark.text,
    fontFamily: 'Cairo_400Regular',
    fontSize: 16,
  },
  footer: { padding: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.dark.cardBorder },
  activeDot: { backgroundColor: colors.dark.primary, width: 24 },
  btn: { width: '100%', marginBottom: 12 },
  skipBtn: { alignItems: 'center', padding: 8 },
  skipText: { color: colors.dark.textSecondary, fontFamily: 'Cairo_400Regular' },
});
