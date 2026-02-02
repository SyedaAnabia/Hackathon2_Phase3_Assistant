// frontend/lib/authService.ts

import apiClient, { authAPI } from './api';
import { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated, getUserFromToken, isTokenExpired } from './auth';

// Service functions for authentication operations
export const authService = {
  // Login function
  login: async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);

      if (response.data && response.data.access_token) {
        const { access_token } = response.data;

        // Store the token in localStorage
        setAuthToken(access_token);
        localStorage.setItem('user_email', email);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Signup function
  signup: async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.signup(email, password);

      if (response.data && response.data.access_token) {
        const { access_token } = response.data;

        // Store the token in localStorage
        setAuthToken(access_token);
        localStorage.setItem('user_email', email);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  // Logout function
  logout: (): void => {
    // Remove token from localStorage
    removeAuthToken();
    localStorage.removeItem('user_email');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return isAuthenticated();
  },

  // Get current user
  getCurrentUser: (): string | null => {
    const user = getUserFromToken();
    if (user) {
      return localStorage.getItem('user_email');
    }
    return null;
  },

  // Refresh token if expired
  refreshToken: async (): Promise<boolean> => {
    try {
      const token = getAuthToken();
      if (!token) {
        return false;
      }

      if (isTokenExpired(token)) {
        // In a real implementation, you would call a refresh endpoint
        // For now, we'll just return false to indicate the user needs to log in again
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  },
};