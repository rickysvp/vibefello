import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Test component that uses auth
function TestComponent() {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="isAuthenticated">{auth.isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="isLoading">{auth.isLoading ? 'true' : 'false'}</div>
      <div data-testid="userRole">{auth.userRole || 'null'}</div>
      <button
        onClick={async () => {
          const result = await auth.signIn('test@test.com', 'password');
          const errorNode = document.querySelector('[data-testid="signInError"]');
          if (errorNode) {
            errorNode.textContent = result.error?.message || '';
          }
        }}
      >
        Sign In
      </button>
      <button onClick={() => auth.signUp('test@test.com', 'password', 'Test User')}>Sign Up</button>
      <button onClick={() => auth.signOut()}>Sign Out</button>
      <div data-testid="signInError" />
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with unauthenticated state', async () => {
    // Mock getSession to return no session
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    });
  });

  it('should handle sign in', async () => {
    const mockUser = { id: '123', email: 'test@test.com' };
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signInButton = screen.getByText('Sign In');
    signInButton.click();

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password',
      });
    });
  });

  it('should handle sign up', async () => {
    const mockUser = { id: '123', email: 'test@test.com' };
    (supabase.auth.signUp as any).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signUpButton = screen.getByText('Sign Up');
    signUpButton.click();

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password',
        options: {
          data: {
            full_name: 'Test User',
          },
        },
      });
    });
  });

  it('should handle sign out', async () => {
    (supabase.auth.signOut as any).mockResolvedValue({ error: null });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signOutButton = screen.getByText('Sign Out');
    signOutButton.click();

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  it('should handle auth errors', async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signInButton = screen.getByText('Sign In');
    signInButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('signInError').textContent).toBe('Invalid credentials');
    });
  });
});
