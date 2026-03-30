import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getProfile, signIn, signOut, signUp } from '../lib/auth';

vi.mock('../lib/auth', () => ({
  getProfile: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
}));

type Session = {
  user: {
    id: string;
    email: string;
  };
};

const profile = {
  id: 'user-1',
  email: 'vibefello@example.com',
  full_name: 'Vibe Fello',
  avatar_url: null,
  role: 'user' as const,
  user_tier: 'free' as const,
  expert_verification_status: 'none' as const,
  expert_bio: null,
  expert_skills: null,
  expert_hourly_rate: null,
  remaining_consults: 3,
  created_at: '2026-03-30T00:00:00.000Z',
  updated_at: '2026-03-30T00:00:00.000Z',
};

function AuthProbe() {
  const auth = useAuth();

  return (
    <div>
      <div data-testid="loading">{auth.isLoading ? 'loading' : 'ready'}</div>
      <div data-testid="authenticated">{auth.isAuthenticated ? 'yes' : 'no'}</div>
      <div data-testid="email">{auth.user?.email ?? 'none'}</div>
      <div data-testid="profile">{auth.profile?.full_name ?? 'none'}</div>
      <button onClick={() => auth.refreshProfile()}>Refresh</button>
      <button onClick={() => auth.signIn('test@test.com', 'password')}>Sign In</button>
      <button onClick={() => auth.signUp('test@test.com', 'password', 'Test User')}>Sign Up</button>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads an existing session and keeps loading until the profile is ready', async () => {
    let authStateChangeCallback: ((event: string, session: Session | null) => void) | null = null;
    let resolveProfile: ((value: unknown) => void) | null = null;

    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null } });
    (supabase.auth.onAuthStateChange as any).mockImplementation((callback: typeof authStateChangeCallback) => {
      authStateChangeCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    (getProfile as any).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveProfile = resolve;
        })
    );

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
    });

    await act(async () => {
      authStateChangeCallback?.('SIGNED_IN', {
        user: {
          id: profile.id,
          email: profile.email,
        },
      });
    });

    expect(getProfile).toHaveBeenCalledWith(profile.id);
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');

    await act(async () => {
      resolveProfile?.({ data: profile, error: null });
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
      expect(screen.getByTestId('email')).toHaveTextContent(profile.email);
      expect(screen.getByTestId('profile')).toHaveTextContent(profile.full_name);
    });
  });

  it('delegates sign-in, sign-up, and sign-out to auth helpers', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null } });
    (signIn as any).mockResolvedValue({ data: null, error: null });
    (signUp as any).mockResolvedValue({ data: null, error: null });
    (signOut as any).mockResolvedValue({ error: null });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    await act(async () => {
      screen.getByText('Sign In').click();
      screen.getByText('Sign Up').click();
      screen.getByText('Sign Out').click();
      screen.getByText('Refresh').click();
    });

    expect(signIn).toHaveBeenCalledWith('test@test.com', 'password');
    expect(signUp).toHaveBeenCalledWith('test@test.com', 'password', 'Test User');
    expect(signOut).toHaveBeenCalled();
  });

  it('refreshes the current profile through the helper', async () => {
    let authStateChangeCallback: ((event: string, session: Session | null) => void) | null = null;
    let resolveProfile: ((value: unknown) => void) | null = null;

    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null } });
    (supabase.auth.onAuthStateChange as any).mockImplementation((callback: typeof authStateChangeCallback) => {
      authStateChangeCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    (getProfile as any).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveProfile = resolve;
        })
    );

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    await act(async () => {
      authStateChangeCallback?.('SIGNED_IN', {
        user: {
          id: profile.id,
          email: profile.email,
        },
      });
    });

    await act(async () => {
      resolveProfile?.({ data: profile, error: null });
    });

    await waitFor(() => {
      expect(screen.getByTestId('profile')).toHaveTextContent(profile.full_name);
    });

    (getProfile as any).mockResolvedValueOnce({ data: profile, error: null });

    await act(async () => {
      screen.getByText('Refresh').click();
    });

    expect(getProfile).toHaveBeenCalledWith(profile.id);
    expect(getProfile).toHaveBeenCalledTimes(2);
  });
});
