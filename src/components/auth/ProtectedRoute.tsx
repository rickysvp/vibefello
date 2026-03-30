import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AppLoadingState } from '../common/AppLoadingState';
import { AppErrorState } from '../common/AppErrorState';

type ProtectedRouteProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <AppLoadingState message="Loading your account..." />;
  }

  if (!isAuthenticated) {
    return fallback ?? <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export function ProtectedRouteError() {
  return <AppErrorState title="Access denied" message="Please sign in to continue." />;
}
