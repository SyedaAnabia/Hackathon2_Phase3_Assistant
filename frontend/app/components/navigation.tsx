'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-black shadow-sm py-4 px-6 flex justify-between items-center border-b border-[#3c3c3c]">
      <Link href="/" className="flex items-center space-x-2 cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10,9 9,9 8,9"></polyline>
          </svg>
        </div>
        <span className="text-xl font-bold text-white">Todo App</span>
      </Link>
      <div className="flex space-x-4">
        {!isAuthenticated ? (
          <>
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg bg-black hover:bg-[#3c3c3c] text-white transition-colors border border-[#3c3c3c]"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 rounded-lg bg-[#BB86FC] hover:bg-[#a770e0] text-white transition-colors shadow-lg shadow-[#BB86FC]/20"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-black hover:bg-[#3c3c3c] text-white transition-colors border border-[#3c3c3c]"
            >
              My Tasks
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors border border-white"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;