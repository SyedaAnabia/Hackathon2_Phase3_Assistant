// frontend/src/lib/mockAuthService.ts
// Temporary mock authentication service to bypass backend issues

import { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated, getUserFromToken } from './auth';

// Mock service functions for authentication operations
export const mockAuthService = {
  // Mock login function
  login: async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real scenario, this would call the backend
      // For mock, we'll simulate successful login
      const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store the mock token in localStorage
      setAuthToken(mockToken);
      localStorage.setItem('user_email', email);

      console.log('Mock login successful for:', email);
      return true;
    } catch (error) {
      console.error('Mock login error:', error);
      return false;
    }
  },

  // Mock signup function
  signup: async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Mock signup called with email:', email);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if user already exists (simulated)
      const existingUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      console.log('Existing users:', existingUsers);
      const userExists = existingUsers.some((user: any) => user.email === email);

      if (userExists) {
        throw new Error('Email already registered');
      }

      // Add new user to mock storage
      const newUser = {
        email,
        createdAt: new Date().toISOString()
      };

      existingUsers.push(newUser);
      localStorage.setItem('mock_users', JSON.stringify(existingUsers));
      console.log('New user added, users now:', existingUsers);

      // After successful signup, automatically log the user in
      console.log('Calling login after signup...');
      return await mockAuthService.login(email, password);
    } catch (error) {
      console.error('Mock signup error:', error);
      throw error;
    }
  },

  // Logout function
  logout: (): void => {
    // Remove token from localStorage
    removeAuthToken();
    localStorage.removeItem('user_email');
    console.log('Mock logout successful');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return isAuthenticated();
  },

  // Get current user
  getCurrentUser: (): any | null => {
    // First check if we have a valid token with user data
    const tokenUser = getUserFromToken();
    if (tokenUser && tokenUser.id) {
      // If the token contains valid user data, return it
      return tokenUser;
    }

    // If token is invalid or doesn't contain user data,
    // return user data from localStorage
    const email = localStorage.getItem('user_email');
    if (email) {
      // Return a mock user object with email and a generated ID
      return {
        id: `mock_user_${Date.now()}`, // Generate a mock ID
        email: email
      };
    }
    return null;
  },
};