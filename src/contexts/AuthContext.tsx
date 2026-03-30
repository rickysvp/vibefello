import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { getProfile, signIn as signInRequest, signOut as signOutRequest, signUp as signUpRequest } from '../lib/auth';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: 'user' | 'expert' | 'admin' | null;
  expertVerificationStatus: 'none' | 'pending' | 'approved' | 'rejected' | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuthBootstrap() {
  const bootstrapTokenRef = useRef(0);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async (sessionUser: User | null) => {
    const token = ++bootstrapTokenRef.current;

    if (!sessionUser) {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setUser(sessionUser);

    try {
      const { data, error } = await getProfile(sessionUser.id);

      if (bootstrapTokenRef.current !== token) {
        return;
      }

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }

      setProfile((data as Profile | null) ?? null);
    } catch (error) {
      if (bootstrapTokenRef.current !== token) {
        return;
      }

      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      if (bootstrapTokenRef.current === token) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      await loadProfile(data.session?.user ?? null);
    };

    bootstrap();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      void loadProfile(session?.user ?? null);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (!user) {
      return;
    }

    await loadProfile(user);
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await signInRequest(email, password);
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await signUpRequest(email, password, fullName);
    return { error };
  };

  const signOut = async () => {
    await signOutRequest();
    bootstrapTokenRef.current += 1;
    setUser(null);
    setProfile(null);
    setIsLoading(false);
  };

  return {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  } = useAuthBootstrap();

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    userRole: profile?.role ?? null,
    expertVerificationStatus: profile?.expert_verification_status ?? null,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
