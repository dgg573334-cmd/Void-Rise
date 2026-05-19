import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { COMPANIONS, DAILY_QUESTS, getXpToNextLevel, getTitleForLevel, type StatType } from '@/constants/gameData';

export interface PlayerStats {
  str: number;
  agi: number;
  vit: number;
  int: number;
  spi: number;
}

export interface DailyQuestProgress {
  exercises: number;
  steps: number;
  focus: number;
  exercisesComplete: boolean;
  stepsComplete: boolean;
  focusComplete: boolean;
  lastResetDate: string;
  allCompletedToday: boolean;
  graceUsed: boolean;
}

export interface ActivityLog {
  id: string;
  type: 'exercises' | 'steps' | 'focus' | 'reading';
  amount: number;
  xpGained: number;
  goldGained: number;
  timestamp: number;
}

export interface GameState {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  totalXp: number;
  gold: number;
  gems: number;
  stats: PlayerStats;
  statPoints: number;
  streak: number;
  titleId: string;
  unlockedTitles: string[];
  companions: string[];
  activeCompanion: string | null;
  isPremium: boolean;
  achievements: string[];
  questProgress: DailyQuestProgress;
  weeklyProgress: { gym: number; reading: number };
  activityLog: ActivityLog[];
  inventory: string[];
  penaltyActive: boolean;
  shieldActive: boolean;
}

interface GameContextType {
  state: GameState;
  addXP: (amount: number, source?: string) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  distributeStat: (stat: StatType) => void;
  logActivity: (type: ActivityLog['type'], amount: number) => void;
  useGrace: () => void;
  buyItem: (itemId: string) => boolean;
  setActiveCompanion: (id: string | null) => void;
  levelUpModal: boolean;
  dismissLevelUp: () => void;
  newLevel: number;
  penaltyOverlay: boolean;
  dismissPenalty: () => void;
  refreshDailyQuests: () => void;
}

const DEFAULT_STATE: GameState = {
  name: 'Void Hunter',
  level: 1,
  xp: 0,
  xpToNext: 100,
  totalXp: 0,
  gold: 500,
  gems: 0,
  stats: { str: 1, agi: 1, vit: 1, int: 1, spi: 1 },
  statPoints: 0,
  streak: 0,
  titleId: 'void_beginner',
  unlockedTitles: ['void_beginner'],
  companions: [],
  activeCompanion: null,
  isPremium: false,
  achievements: [],
  questProgress: {
    exercises: 0,
    steps: 0,
    focus: 0,
    exercisesComplete: false,
    stepsComplete: false,
    focusComplete: false,
    lastResetDate: '',
    allCompletedToday: false,
    graceUsed: false,
  },
  weeklyProgress: { gym: 0, reading: 0 },
  activityLog: [],
  inventory: [],
  penaltyActive: false,
  shieldActive: false,
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const [levelUpModal, setLevelUpModal] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [penaltyOverlay, setPenaltyOverlay] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('void_game_state');
      if (saved) {
        const parsed: GameState = JSON.parse(saved);
        const today = new Date().toDateString();
        if (parsed.questProgress.lastResetDate !== today) {
          const allDone = parsed.questProgress.allCompletedToday;
          const hasShield = parsed.shieldActive;
          if (!allDone && !hasShield && parsed.questProgress.lastResetDate !== '') {
            parsed.streak = 0;
            setPenaltyOverlay(true);
          } else if (allDone) {
            parsed.streak = (parsed.streak || 0) + 1;
          }
          parsed.questProgress = {
            ...DEFAULT_STATE.questProgress,
            lastResetDate: today,
          };
          parsed.shieldActive = false;
        }
        setState(parsed);
      } else {
        const today = new Date().toDateString();
        setState((s) => ({ ...s, questProgress: { ...s.questProgress, lastResetDate: today } }));
      }
      initialized.current = true;
    })();
  }, []);

  const save = useCallback(async (s: GameState) => {
    await AsyncStorage.setItem('void_game_state', JSON.stringify(s));
  }, []);

  const update = useCallback(
    (updater: (prev: GameState) => GameState) => {
      setState((prev) => {
        const next = updater(prev);
        save(next);
        return next;
      });
    },
    [save],
  );

  const addXP = useCallback(
    (amount: number) => {
      update((prev) => {
        let { xp, level, xpToNext, totalXp, statPoints, unlockedTitles, titleId } = prev;
        xp += amount;
        totalXp += amount;
        let didLevelUp = false;
        let newLvl = level;
        while (xp >= xpToNext) {
          xp -= xpToNext;
          level++;
          newLvl = level;
          xpToNext = getXpToNextLevel(level);
          statPoints += 3;
          didLevelUp = true;
          const titleForLevel = getTitleForLevel(level);
          if (!unlockedTitles.includes(titleForLevel.id)) {
            unlockedTitles = [...unlockedTitles, titleForLevel.id];
            titleId = titleForLevel.id;
          }
        }
        if (didLevelUp) {
          setNewLevel(newLvl);
          setLevelUpModal(true);
        }
        return { ...prev, xp, level, xpToNext, totalXp, statPoints, unlockedTitles, titleId };
      });
    },
    [update],
  );

  const addGold = useCallback(
    (amount: number) => {
      update((prev) => ({ ...prev, gold: prev.gold + amount }));
    },
    [update],
  );

  const spendGold = useCallback(
    (amount: number): boolean => {
      let success = false;
      update((prev) => {
        if (prev.gold >= amount) {
          success = true;
          return { ...prev, gold: prev.gold - amount };
        }
        return prev;
      });
      return success;
    },
    [update],
  );

  const distributeStat = useCallback(
    (stat: StatType) => {
      update((prev) => {
        if (prev.statPoints <= 0) return prev;
        return {
          ...prev,
          statPoints: prev.statPoints - 1,
          stats: { ...prev.stats, [stat]: prev.stats[stat] + 1 },
        };
      });
    },
    [update],
  );

  const logActivity = useCallback(
    (type: ActivityLog['type'], amount: number) => {
      update((prev) => {
        const questProgress = { ...prev.questProgress };
        let xpGain = 0;
        let goldGain = 0;

        if (type === 'exercises') {
          questProgress.exercises = Math.min(questProgress.exercises + amount, DAILY_QUESTS[0].target);
          if (!questProgress.exercisesComplete && questProgress.exercises >= DAILY_QUESTS[0].target) {
            questProgress.exercisesComplete = true;
            xpGain += 50;
            goldGain += 100;
          } else {
            xpGain += Math.floor(amount * 0.5);
            goldGain += Math.floor(amount * 1);
          }
        } else if (type === 'steps') {
          questProgress.steps = Math.min(questProgress.steps + amount, DAILY_QUESTS[1].target);
          if (!questProgress.stepsComplete && questProgress.steps >= DAILY_QUESTS[1].target) {
            questProgress.stepsComplete = true;
            xpGain += 50;
            goldGain += 100;
          } else {
            xpGain += Math.floor(amount * 0.005);
            goldGain += Math.floor(amount * 0.01);
          }
        } else if (type === 'focus') {
          questProgress.focus = Math.min(questProgress.focus + amount, DAILY_QUESTS[2].target);
          if (!questProgress.focusComplete && questProgress.focus >= DAILY_QUESTS[2].target) {
            questProgress.focusComplete = true;
            xpGain += 50;
            goldGain += 100;
          } else {
            xpGain += Math.floor(amount * 1);
            goldGain += Math.floor(amount * 2);
          }
        } else if (type === 'reading') {
          xpGain += Math.floor(amount * 2);
          goldGain += Math.floor(amount * 3);
        }

        const allDone = questProgress.exercisesComplete && questProgress.stepsComplete && questProgress.focusComplete;
        if (allDone && !questProgress.allCompletedToday) {
          questProgress.allCompletedToday = true;
          xpGain += 50;
          goldGain += 50;
        }

        const companion = prev.activeCompanion ? COMPANIONS.find((c) => c.id === prev.activeCompanion) : null;
        if (companion) xpGain = Math.floor(xpGain * (1 + companion.xpBonus));

        const logEntry: ActivityLog = {
          id: Date.now().toString(),
          type,
          amount,
          xpGained: xpGain,
          goldGained: goldGain,
          timestamp: Date.now(),
        };

        const next = {
          ...prev,
          gold: prev.gold + goldGain,
          activityLog: [logEntry, ...prev.activityLog].slice(0, 50),
          questProgress,
        };

        if (xpGain > 0) {
          setTimeout(() => addXP(xpGain), 0);
        }
        return next;
      });
    },
    [update, addXP],
  );

  const useGrace = useCallback(() => {
    update((prev) => {
      if (prev.questProgress.graceUsed) return prev;
      return { ...prev, questProgress: { ...prev.questProgress, graceUsed: true } };
    });
  }, [update]);

  const buyItem = useCallback(
    (itemId: string): boolean => {
      let success = false;
      if (itemId === 'shield_protection') {
        update((prev) => {
          if (prev.gold < 800) return prev;
          success = true;
          return { ...prev, gold: prev.gold - 800, shieldActive: true };
        });
      } else if (itemId === 'scroll_reset') {
        update((prev) => {
          if (prev.gold < 2000) return prev;
          success = true;
          const totalStats = prev.stats.str + prev.stats.agi + prev.stats.vit + prev.stats.int + prev.stats.spi - 5;
          return {
            ...prev,
            gold: prev.gold - 2000,
            stats: { str: 1, agi: 1, vit: 1, int: 1, spi: 1 },
            statPoints: prev.statPoints + totalStats,
          };
        });
      }
      return success;
    },
    [update],
  );

  const setActiveCompanion = useCallback(
    (id: string | null) => {
      update((prev) => ({ ...prev, activeCompanion: id }));
    },
    [update],
  );

  const dismissLevelUp = useCallback(() => setLevelUpModal(false), []);
  const dismissPenalty = useCallback(() => setPenaltyOverlay(false), []);
  const refreshDailyQuests = useCallback(() => {
    update((prev) => ({
      ...prev,
      questProgress: { ...DEFAULT_STATE.questProgress, lastResetDate: new Date().toDateString() },
    }));
  }, [update]);

  return (
    <GameContext.Provider
      value={{
        state,
        addXP,
        addGold,
        spendGold,
        distributeStat,
        logActivity,
        useGrace,
        buyItem,
        setActiveCompanion,
        levelUpModal,
        dismissLevelUp,
        newLevel,
        penaltyOverlay,
        dismissPenalty,
        refreshDailyQuests,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
