// frontend/src/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, removeAuthToken, isAuthenticated as checkIsAuthenticated } from '@/lib/auth';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on mount
    const token = getAuthToken();
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const logout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  const checkAuthStatus = () => {
    const authenticated = checkIsAuthenticated();
    setIsAuthenticated(authenticated);
    return authenticated;
  };

  return {
    isAuthenticated,
    loading,
    logout,
    checkAuthStatus,
  };
};

export default useAuth;