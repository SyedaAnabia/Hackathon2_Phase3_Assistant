"use client";

import { useState } from 'react';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { login, signup, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }

      // Redirect to dashboard page after successful login
      router.push('/dashboard');
    } catch (err: any) {
      console.error(isSignUp ? 'Signup' : 'Login', 'error:', err);
      setError(err.message || (isSignUp ? 'Signup failed' : 'Login failed'));
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
    router.refresh(); // Refresh to update the UI
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] to-[#000000] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-black rounded-2xl shadow-xl overflow-hidden md:max-w-2xl border border-[#3c3c3c]">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h1>
            <p className="text-white">
              {isSignUp ? 'Sign up to manage your todos' : 'Sign in to your account'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 text-white rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-black border border-[#3c3c3c] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BB86FC] text-white placeholder-white"
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-black border border-[#3c3c3c] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BB86FC] pr-10 text-white placeholder-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.647l-1.514-1.515a4 4 0 005.478-5.478l1.514 1.514a4 4 0 00-5.478 5.478z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-[#3c3c3c] text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-lg shadow-black/20 border border-white"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            {isSignUp ? (
              <Link href="/auth/login" className="text-[#BB86FC] hover:text-[#d0b8fc] font-medium">
                Already have an account? Sign In
              </Link>
            ) : (
              <Link href="/auth/signup" className="text-[#BB86FC] hover:text-[#d0b8fc] font-medium">
                Don't have an account? Sign Up
              </Link>
            )}
          </div>

          {/* Logout button for testing purposes */}
          <div className="mt-6 text-center">
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 font-medium text-sm"
            >
              Logout (for testing)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}