import { useAuth } from '../contexts/AuthContext';

export function useCurrentProfile() {
  const { profile } = useAuth();
  return profile;
}
