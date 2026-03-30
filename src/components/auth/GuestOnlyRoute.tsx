import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AppLoadingState } from '../common/AppLoadingState';
import { AppErrorState } from '../common/AppErrorState';

type GuestOnlyRouteProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export function GuestOnlyRoute({ children, fallback }: GuestOnlyRouteProps) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <AppLoadingState message="Preparing your session..." />;
  }

  if (isAuthenticated) {
    return fallback ?? <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export function GuestOnlyRouteError() {
  return <AppErrorState title="Already signed in" message="You are already signed in." />;
}
