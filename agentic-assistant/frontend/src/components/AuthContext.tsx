import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';

interface AuthContextType {
  user: any;
  loading: boolean;
  authStatus: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  authError: string | null;
  setAuthError: (err: string | null) => void;
  login: (email: string, password: string) => Promise<{ error: any } | undefined>;
  signup: (email: string, password: string) => Promise<{ error: any } | undefined>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'authenticated' | 'unauthenticated'>('idle');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setAuthStatus('loading');
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && data.session.user) {
        setUser(data.session.user);
        setAuthStatus('authenticated');
      } else {
        setUser(null);
        setAuthStatus('unauthenticated');
      }
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        setUser(session.user);
        setAuthStatus('authenticated');
      } else {
        setUser(null);
        setAuthStatus('unauthenticated');
      }
      setLoading(false);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setAuthStatus('loading');
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    const { data } = await supabase.auth.getSession();
    if (!error && data.session && data.session.user) {
      setUser(data.session.user);
      setAuthStatus('authenticated');
      setAuthError(null);
      await supabase.from('user_sessions').insert([
        { user_id: data.session.user.id, agent_id: null, query: 'login', response: 'User logged in', created_at: new Date().toISOString() }
      ]);
    } else {
      setUser(null);
      setAuthStatus('unauthenticated');
      // Set error globally
      if (error) {
        const msg = error.message?.toLowerCase() || '';
        const code = error.code;
        if (msg.includes('email not confirmed') || msg.includes('confirm')) {
          setAuthError('Please confirm your email before logging in. Check your inbox for a confirmation link.');
        } else if (msg.includes('invalid login credentials') || code === 'invalid_credentials') {
          setAuthError('Invalid email or password. Please try again.');
        } else if (msg.includes('user not found') || code === 'user_not_found') {
          setAuthError('No account found with this email. Please sign up first.');
        } else if (msg.includes('rate limit') || code === 'rate_limit_exceeded') {
          setAuthError('Too many login attempts. Please wait and try again later.');
        } else if (msg.includes('network') || code === 'network_error') {
          setAuthError('Network error. Please check your connection and try again.');
        } else if (msg) {
          setAuthError(error.message);
        } else {
          setAuthError('An unknown error occurred. Please try again.');
        }
      }
    }
    setLoading(false);
    return { error };
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setAuthStatus('loading');
    setAuthError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    const { data } = await supabase.auth.getSession();
    if (!error && data.session && data.session.user) {
      setUser(data.session.user);
      setAuthStatus('authenticated');
      setAuthError(null);
      await supabase.from('user_sessions').insert([
        { user_id: data.session.user.id, agent_id: null, query: 'signup', response: 'User signed up', created_at: new Date().toISOString() }
      ]);
    } else {
      setUser(null);
      setAuthStatus('unauthenticated');
      // Set error globally
      if (error) {
        const msg = error.message?.toLowerCase() || '';
        const code = error.code;
        if (msg.includes('email already registered') || code === 'user_already_registered') {
          setAuthError('This email is already registered. Please log in or use a different email.');
        } else if (msg.includes('weak password')) {
          setAuthError('Password is too weak. Please use a stronger password.');
        } else if (msg.includes('rate limit') || code === 'rate_limit_exceeded') {
          setAuthError('Too many signup attempts. Please wait and try again later.');
        } else if (msg.includes('network') || code === 'network_error') {
          setAuthError('Network error. Please check your connection and try again.');
        } else if (msg) {
          setAuthError(error.message);
        } else {
          setAuthError('Signup failed. Please try again.');
        }
      }
    }
    setLoading(false);
    return { error };
  };

  const logout = async () => {
    setLoading(true);
    setAuthStatus('loading');
    setAuthError(null);
    try {
      await supabase.auth.signOut();
    } catch (err: any) {
      if (err?.message !== "Session from session_id claim in JWT does not exist") {
        console.error("Logout error:", err);
      }
    }
    setUser(null);
    setAuthStatus('unauthenticated');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, authStatus, authError, setAuthError, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 