import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase, isUsingDemoCredentials } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isUsingDemoCredentials) {
      // Skip auth in demo mode
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Create profile on sign up
        if (event === 'SIGNED_UP' as AuthChangeEvent && session?.user) {
          await supabase.from('profiles').insert([
            {
              id: session.user.id,
              email: session.user.email,
            },
          ]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    if (isUsingDemoCredentials) {
      // Simulate successful signup in demo mode
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
        user_metadata: { full_name: fullName }
      };
      setUser(mockUser as any);
      setSession({ user: mockUser } as any);
      return { data: { user: mockUser }, error: null };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data.user && !error) {
      // Update profile with full name
      await supabase.from('profiles').upsert([
        {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
        },
      ]);
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    if (isUsingDemoCredentials) {
      // Simulate successful login in demo mode
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
      };
      setUser(mockUser as any);
      setSession({ user: mockUser } as any);
      return { data: { user: mockUser }, error: null };
    }
    
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signOut = async () => {
    if (isUsingDemoCredentials) {
      return;
    }
    
    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}