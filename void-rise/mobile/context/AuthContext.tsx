import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isOnboarded: boolean;
  login: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const userJson = await AsyncStorage.getItem('void_user');
        const onboarded = await AsyncStorage.getItem('void_onboarded');
        if (userJson) setUser(JSON.parse(userJson));
        if (onboarded === 'true') setIsOnboarded(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (name: string, email: string) => {
    const u: User = {
      id: Date.now().toString(),
      name,
      email,
    };
    await AsyncStorage.setItem('void_user', JSON.stringify(u));
    setUser(u);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['void_user', 'void_onboarded']);
    setUser(null);
    setIsOnboarded(false);
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('void_onboarded', 'true');
    setIsOnboarded(true);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isOnboarded, login, logout, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
