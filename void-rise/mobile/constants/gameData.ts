export type StatType = 'str' | 'agi' | 'vit' | 'int' | 'spi';
export type QuestType = 'daily' | 'weekly' | 'monthly';
export type QuestCategory = 'exercises' | 'steps' | 'focus' | 'reading' | 'streak' | 'boss';

export interface QuestTemplate {
  id: string;
  type: QuestType;
  category: QuestCategory;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  target: number;
  unit: string;
  xpReward: number;
  goldReward: number;
  statBoost?: { stat: StatType; amount: number };
}

export interface ShopItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  price: number;
  currency: 'gold' | 'gems' | 'usd';
  category: 'virtual' | 'real';
  effect?: string;
}

export interface CompanionData {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  type: 'basic' | 'knowledge' | 'combat' | 'legendary' | 'tech';
  bonusAr: string;
  bonusEn: string;
  unlockConditionAr: string;
  unlockConditionEn: string;
  xpBonus: number;
  color: string;
}

export interface TitleData {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  conditionAr: string;
  conditionEn: string;
  xpBonus: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AchievementData {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  descAr: string;
  descEn: string;
}

export interface MindGateQuestion {
  question: string;
  options: string[];
  correct: number;
}

export const DAILY_QUESTS: QuestTemplate[] = [
  {
    id: 'daily_exercises',
    type: 'daily',
    category: 'exercises',
    nameAr: 'تمارين اليوم',
    nameEn: 'Daily Exercises',
    descAr: 'أكمل 50 تمرينة',
    descEn: 'Complete 50 exercises',
    target: 50,
    unit: 'reps',
    xpReward: 50,
    goldReward: 100,
  },
  {
    id: 'daily_steps',
    type: 'daily',
    category: 'steps',
    nameAr: 'خطوات اليوم',
    nameEn: 'Daily Steps',
    descAr: 'امشِ 6,000 خطوة',
    descEn: 'Walk 6,000 steps',
    target: 6000,
    unit: 'steps',
    xpReward: 50,
    goldReward: 100,
  },
  {
    id: 'daily_focus',
    type: 'daily',
    category: 'focus',
    nameAr: 'جلسة التركيز',
    nameEn: 'Focus Session',
    descAr: 'ركّز لمدة 45 دقيقة',
    descEn: 'Focus for 45 minutes',
    target: 45,
    unit: 'min',
    xpReward: 50,
    goldReward: 100,
  },
];

export const WEEKLY_QUESTS: QuestTemplate[] = [
  {
    id: 'weekly_streak',
    type: 'weekly',
    category: 'streak',
    nameAr: 'الالتزام الأسبوعي',
    nameEn: 'Weekly Streak',
    descAr: 'أكمل 7 أيام متواصلة',
    descEn: 'Complete 7 consecutive days',
    target: 7,
    unit: 'days',
    xpReward: 300,
    goldReward: 500,
  },
  {
    id: 'weekly_gym',
    type: 'weekly',
    category: 'exercises',
    nameAr: '3 جلسات جيم',
    nameEn: '3 Gym Sessions',
    descAr: 'أكمل 3 جلسات تمارين',
    descEn: 'Complete 3 training sessions',
    target: 3,
    unit: 'sessions',
    xpReward: 250,
    goldReward: 400,
    statBoost: { stat: 'str', amount: 2 },
  },
  {
    id: 'weekly_reading',
    type: 'weekly',
    category: 'reading',
    nameAr: '3 ساعات قراءة',
    nameEn: '3 Hours Reading',
    descAr: 'اقرأ لمدة 3 ساعات',
    descEn: 'Read for 3 hours',
    target: 180,
    unit: 'min',
    xpReward: 200,
    goldReward: 350,
    statBoost: { stat: 'int', amount: 2 },
  },
];

export const BOSS_RAIDS: QuestTemplate[] = [
  {
    id: 'boss_laziness',
    type: 'monthly',
    category: 'boss',
    nameAr: 'تنين الكسل',
    nameEn: 'Dragon of Laziness',
    descAr: 'أكمل 30 يوم من الالتزام الكامل',
    descEn: 'Complete 30 days of full commitment',
    target: 30,
    unit: 'days',
    xpReward: 2000,
    goldReward: 5000,
  },
  {
    id: 'boss_knowledge',
    type: 'monthly',
    category: 'boss',
    nameAr: 'حارس المعرفة',
    nameEn: 'Knowledge Guardian',
    descAr: 'أنهِ 4 كتب هذا الشهر',
    descEn: 'Finish 4 books this month',
    target: 4,
    unit: 'books',
    xpReward: 1500,
    goldReward: 3000,
  },
  {
    id: 'boss_iron',
    type: 'monthly',
    category: 'boss',
    nameAr: 'عملاق الحديد',
    nameEn: 'Iron Giant',
    descAr: 'حقق رقماً قياسياً جديداً في التمرين',
    descEn: 'Hit a new personal record in training',
    target: 1,
    unit: 'PR',
    xpReward: 2500,
    goldReward: 4000,
  },
];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'elixir_health',
    nameAr: 'إكسير الشفاء',
    nameEn: 'Healing Elixir',
    descAr: 'تخطي مهمة واحدة',
    descEn: 'Skip one quest',
    icon: '🧪',
    price: 500,
    currency: 'gold',
    category: 'virtual',
    effect: 'skip_quest',
  },
  {
    id: 'challenge_key',
    nameAr: 'مفتاح التحدي',
    nameEn: 'Challenge Key',
    descAr: 'فتح تحدي فوري',
    descEn: 'Unlock an instant challenge',
    icon: '🗝️',
    price: 300,
    currency: 'gold',
    category: 'virtual',
    effect: 'unlock_challenge',
  },
  {
    id: 'scroll_reset',
    nameAr: 'لفافة إعادة التعيين',
    nameEn: 'Scroll of Reset',
    descAr: 'إعادة توزيع النقاط',
    descEn: 'Redistribute stat points',
    icon: '📜',
    price: 2000,
    currency: 'gold',
    category: 'virtual',
    effect: 'reset_stats',
  },
  {
    id: 'focus_elixir',
    nameAr: 'إكسير التركيز',
    nameEn: 'Focus Elixir',
    descAr: 'مضاعف XP للذكاء',
    descEn: 'XP multiplier for intelligence',
    icon: '⚡',
    price: 200,
    currency: 'gold',
    category: 'virtual',
    effect: 'xp_boost_int',
  },
  {
    id: 'shield_protection',
    nameAr: 'درع الحماية',
    nameEn: 'Protection Shield',
    descAr: 'حماية من عقوبة يوم كامل',
    descEn: 'Protection from penalty for one day',
    icon: '🛡️',
    price: 800,
    currency: 'gold',
    category: 'virtual',
    effect: 'shield_day',
  },
  {
    id: 'combo_card',
    nameAr: 'بطاقة كومبو',
    nameEn: 'Combo Card',
    descAr: 'تفعيل كومبو تلقائي',
    descEn: 'Activate automatic combo',
    icon: '🎴',
    price: 400,
    currency: 'gold',
    category: 'virtual',
    effect: 'auto_combo',
  },
  {
    id: 'void_glow',
    nameAr: 'توهج الفراغ',
    nameEn: 'Void Glow',
    descAr: 'تأثير بصري مميز لأسبوع',
    descEn: 'Special visual effect for a week',
    icon: '🌟',
    price: 1000,
    currency: 'gold',
    category: 'virtual',
    effect: 'visual_effect',
  },
  {
    id: 'gems_100',
    nameAr: '100 جوهرة',
    nameEn: '100 Gems',
    descAr: 'كمية صغيرة للبداية',
    descEn: 'Small starter pack',
    icon: '💎',
    price: 0.99,
    currency: 'usd',
    category: 'real',
  },
  {
    id: 'gems_500',
    nameAr: '500 جوهرة',
    nameEn: '500 Gems',
    descAr: 'قيمة جيدة',
    descEn: 'Good value',
    icon: '💎',
    price: 3.99,
    currency: 'usd',
    category: 'real',
  },
  {
    id: 'gems_1200',
    nameAr: '1,200 جوهرة',
    nameEn: '1,200 Gems',
    descAr: 'الأكثر شعبية',
    descEn: 'Most popular',
    icon: '💎',
    price: 7.99,
    currency: 'usd',
    category: 'real',
  },
  {
    id: 'void_shield_week',
    nameAr: 'درع الفراغ الأسبوعي',
    nameEn: 'Weekly Void Shield',
    descAr: 'حماية أسبوع من العقوبات',
    descEn: 'One week penalty protection',
    icon: '🛡️',
    price: 2.99,
    currency: 'usd',
    category: 'real',
    effect: 'shield_week',
  },
];

export const COMPANIONS: CompanionData[] = [
  {
    id: 'shadow_wolf',
    nameAr: 'ظل الذئب',
    nameEn: 'Shadow Wolf',
    icon: '🐺',
    type: 'basic',
    bonusAr: '+2% XP تمارين',
    bonusEn: '+2% Exercise XP',
    unlockConditionAr: 'أكمل 7 أيام متواصلة',
    unlockConditionEn: 'Complete 7 consecutive days',
    xpBonus: 0.02,
    color: '#8892A4',
  },
  {
    id: 'eagle_eye',
    nameAr: 'عين النسر',
    nameEn: 'Eagle Eye',
    icon: '🦅',
    type: 'knowledge',
    bonusAr: '+2% XP قراءة',
    bonusEn: '+2% Reading XP',
    unlockConditionAr: 'اقرأ 10 كتب',
    unlockConditionEn: 'Read 10 books',
    xpBonus: 0.02,
    color: '#FFD700',
  },
  {
    id: 'iron_fist',
    nameAr: 'قبضة الطاغية',
    nameEn: 'Iron Fist',
    icon: '🦾',
    type: 'combat',
    bonusAr: '+5% XP تمارين',
    bonusEn: '+5% Exercise XP',
    unlockConditionAr: 'قوة 20',
    unlockConditionEn: 'Strength 20',
    xpBonus: 0.05,
    color: '#FF3B3B',
  },
  {
    id: 'mind_ghost',
    nameAr: 'شبح الحكيم',
    nameEn: 'Mind Ghost',
    icon: '🧠',
    type: 'knowledge',
    bonusAr: '+5% XP مذاكرة',
    bonusEn: '+5% Study XP',
    unlockConditionAr: 'ذكاء 25',
    unlockConditionEn: 'Intelligence 25',
    xpBonus: 0.05,
    color: '#B44CFF',
  },
  {
    id: 'void_dragon',
    nameAr: 'تنين الفراغ',
    nameEn: 'Void Dragon',
    icon: '🐉',
    type: 'legendary',
    bonusAr: '+10% كل XP',
    bonusEn: '+10% All XP',
    unlockConditionAr: 'المستوى 30',
    unlockConditionEn: 'Level 30',
    xpBonus: 0.10,
    color: '#00F0FF',
  },
  {
    id: 'code_guardian',
    nameAr: 'حارس الكود',
    nameEn: 'Code Guardian',
    icon: '🤖',
    type: 'tech',
    bonusAr: '+5% XP تقني',
    bonusEn: '+5% Tech XP',
    unlockConditionAr: 'أنهِ 3 كورسات برمجة',
    unlockConditionEn: 'Complete 3 coding courses',
    xpBonus: 0.05,
    color: '#00FF88',
  },
];

export const TITLES: TitleData[] = [
  {
    id: 'void_beginner',
    nameAr: 'مبتدئ الفراغ',
    nameEn: 'Void Beginner',
    icon: '🌱',
    conditionAr: 'المستوى 1',
    conditionEn: 'Level 1',
    xpBonus: 0,
    rarity: 'common',
  },
  {
    id: 'void_walker',
    nameAr: 'سائر الفراغ',
    nameEn: 'Void Walker',
    icon: '🚶',
    conditionAr: 'المستوى 5',
    conditionEn: 'Level 5',
    xpBonus: 0.02,
    rarity: 'common',
  },
  {
    id: 'void_knight',
    nameAr: 'فارس الفراغ',
    nameEn: 'Void Knight',
    icon: '⚔️',
    conditionAr: 'المستوى 10',
    conditionEn: 'Level 10',
    xpBonus: 0.05,
    rarity: 'rare',
  },
  {
    id: 'dawn_hawk',
    nameAr: 'صقر الفجر',
    nameEn: 'Dawn Hawk',
    icon: '🦅',
    conditionAr: '7 أيام استيقاظ فجراً',
    conditionEn: '7 days early rising',
    xpBonus: 0.10,
    rarity: 'rare',
  },
  {
    id: 'iron_grip',
    nameAr: 'قبضة الحديد',
    nameEn: 'Iron Grip',
    icon: '🦾',
    conditionAr: 'قوة 15',
    conditionEn: 'Strength 15',
    xpBonus: 0,
    rarity: 'rare',
  },
  {
    id: 'dark_sage',
    nameAr: 'حكيم الظلام',
    nameEn: 'Dark Sage',
    icon: '📚',
    conditionAr: 'ذكاء 20',
    conditionEn: 'Intelligence 20',
    xpBonus: 0.15,
    rarity: 'epic',
  },
  {
    id: 'lone_wolf',
    nameAr: 'ذئب العزلة',
    nameEn: 'Lone Wolf',
    icon: '🐺',
    conditionAr: '30 يوم التزام كامل',
    conditionEn: '30 days full commitment',
    xpBonus: 0.05,
    rarity: 'epic',
  },
  {
    id: 'void_lord',
    nameAr: 'لورد الفراغ',
    nameEn: 'Void Lord',
    icon: '👑',
    conditionAr: 'المستوى 20',
    conditionEn: 'Level 20',
    xpBonus: 0.10,
    rarity: 'legendary',
  },
  {
    id: 'phoenix',
    nameAr: 'طائر الفينيق',
    nameEn: 'Phoenix',
    icon: '🔥',
    conditionAr: 'عودة بعد 7 أيام غياب',
    conditionEn: 'Return after 7 days absence',
    xpBonus: 0.25,
    rarity: 'legendary',
  },
];

export const ACHIEVEMENTS: AchievementData[] = [
  { id: 'first_step', nameAr: 'الخطوة الأولى', nameEn: 'First Step', icon: '🎯', descAr: 'أول مهمة مكتملة', descEn: 'First quest completed' },
  { id: 'week_fire', nameAr: 'أسبوع النار', nameEn: 'Week of Fire', icon: '🔥', descAr: '7 أيام متواصلة', descEn: '7 consecutive days' },
  { id: 'hundred', nameAr: 'المئة', nameEn: 'The Hundred', icon: '💯', descAr: '100 مهمة مكتملة', descEn: '100 quests completed' },
  { id: 'book_lover', nameAr: 'عاشق الكتب', nameEn: 'Book Lover', icon: '📚', descAr: '50 ساعة قراءة', descEn: '50 hours of reading' },
  { id: 'gym_beast', nameAr: 'وحش الجيم', nameEn: 'Gym Beast', icon: '🏋️', descAr: '100 جلسة تمرين', descEn: '100 training sessions' },
];

export const MIND_GATE_QUESTIONS: MindGateQuestion[] = [
  { question: 'What is 12 × 12?', options: ['132', '144', '156', '168'], correct: 1 },
  { question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], correct: 1 },
  { question: 'What is the capital of Japan?', options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'], correct: 2 },
  { question: 'Which planet is closest to the sun?', options: ['Venus', 'Earth', 'Mars', 'Mercury'], correct: 3 },
  { question: 'What is 15% of 200?', options: ['25', '30', '35', '40'], correct: 1 },
  { question: 'How many minutes in 3 hours?', options: ['150', '180', '200', '210'], correct: 1 },
  { question: 'What is the square root of 81?', options: ['7', '8', '9', '10'], correct: 2 },
  { question: 'How many bones in the human body?', options: ['196', '206', '216', '226'], correct: 1 },
  { question: 'What language does React Native use?', options: ['Swift', 'Kotlin', 'JavaScript', 'Python'], correct: 2 },
  { question: 'What does CPU stand for?', options: ['Core Processing Unit', 'Central Processing Unit', 'Computer Power Unit', 'Control Power Unit'], correct: 1 },
];

export function getXpToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getTitleForLevel(level: number): TitleData {
  if (level >= 20) return TITLES[7];
  if (level >= 10) return TITLES[2];
  if (level >= 5) return TITLES[1];
  return TITLES[0];
}

export const STAT_COLORS: Record<StatType, string> = {
  str: '#FF3B3B',
  agi: '#00FF88',
  vit: '#FFD700',
  int: '#B44CFF',
  spi: '#E0E7FF',
};

export const STAT_ICONS: Record<StatType, string> = {
  str: '💪',
  agi: '🏃',
  vit: '🛡️',
  int: '🧠',
  spi: '🌟',
};
