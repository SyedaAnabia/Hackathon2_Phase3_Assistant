'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
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
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-[#BB86FC] hover:bg-[#a770e0] text-white transition-colors shadow-lg shadow-[#BB86FC]/20"
            >
              My Tasks
            </Link>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#BB86FC] to-[#03DAC6] mb-6">
            Manage your tasks
          </h1>
          <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto">
            Organize your work and life with our intuitive task manager
          </p>

          <div className="relative mb-12 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#BB86FC] to-[#03DAC6] rounded-2xl blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative bg-black border-2 border-[#3c3c3c] rounded-2xl w-full h-64 md:h-96 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#BB86FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-lg text-white">Task Management Dashboard</p>
                <p className="text-sm text-white/70">Visual representation of your tasks</p>
              </div>
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="space-y-4">
              <Link
                href="/auth/signup"
                className="inline-block px-10 py-5 text-xl font-bold rounded-xl bg-black hover:bg-[#3c3c3c] text-white transition-all transform hover:scale-105 shadow-2xl shadow-black/30 border border-white"
              >
                Get Started
              </Link>
              <p className="text-white/70 mt-4">Join thousands of productive users</p>
            </div>
          ) : (
            <Link
              href="/dashboard"
              className="inline-block px-10 py-5 text-xl font-bold rounded-xl bg-black hover:bg-[#3c3c3c] text-white transition-all transform hover:scale-105 shadow-2xl shadow-black/30 border border-white"
            >
              View Your Tasks
            </Link>
          )}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-black/50 p-6 rounded-2xl border border-[#3c3c3c] hover:border-[#BB86FC]/50 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#BB86FC]/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#BB86FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Organize Tasks</h3>
              <p className="text-white">Effortlessly organize your tasks with our intuitive interface</p>
            </div>

            <div className="bg-black/50 p-6 rounded-2xl border border-[#3c3c3c] hover:border-[#BB86FC]/50 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#03DAC6]/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#03DAC6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Save Time</h3>
              <p className="text-white">Focus on what matters most with smart productivity tools</p>
            </div>

            <div className="bg-black/50 p-6 rounded-2xl border border-[#3c3c3c] hover:border-[#BB86FC]/50 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#BB86FC]/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#BB86FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Secure & Private</h3>
              <p className="text-white">Your data is encrypted and securely stored with privacy in mind</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}