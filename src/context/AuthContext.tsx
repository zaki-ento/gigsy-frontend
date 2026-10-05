'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';

type UserProfile = {
  id: number;
  type: 'freelancer' | 'employer';
  title: string;
  tagline?: string;
  avatar_url?: string;
  wallet_balance?: number;
};

type AuthContextType = {
  token: string | null;
  profile: UserProfile | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('gigneo_jwt_token');
    if (storedToken) {
      setToken(storedToken);
      fetchProfileData(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchProfileData = async (activeToken: string) => {
    try {
      const data = await fetchApi('/profiles/me', {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      // If token is invalid, log out automatically
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (newToken: string) => {
    localStorage.setItem('gigneo_jwt_token', newToken);
    setToken(newToken);
    setIsLoading(true);
    fetchProfileData(newToken);
  };

  const logout = () => {
    localStorage.removeItem('gigneo_jwt_token');
    setToken(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ token, profile, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
