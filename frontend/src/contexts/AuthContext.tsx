// frontend/src/contexts/AuthContext.tsx

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authServiceToUse as authService } from '../lib/authServiceSelector'; // Import the selected auth service

interface AuthContextType {
  user: any | null;
  currentUser: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticatedState, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuthStatus = async () => {
      try {
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const user = authService.getCurrentUser();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('AuthContext login called with email:', email);
      await authService.login(email, password);
      console.log('AuthService login completed');

      setIsAuthenticated(true);
      const user = authService.getCurrentUser();
      console.log('Current user after login:', user);
      setCurrentUser(user);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('AuthContext signup called with email:', email);
      await authService.signup(email, password);
      console.log('AuthService signup completed');

      // Automatically log in after successful signup
      console.log('Attempting login after signup...');
      const loginResult = await login(email, password);
      console.log('Login result after signup:', loginResult);
      return loginResult;
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Signup error details:', error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    router.push('/auth/login');
  };

  const value = {
    user: currentUser,
    currentUser,
    login,
    logout,
    signup,
    loading,
    isLoading: loading,
    isAuthenticated: isAuthenticatedState,
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