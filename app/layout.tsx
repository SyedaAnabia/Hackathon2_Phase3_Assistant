import type { Metadata } from 'next';
import './globals.css';
import FloatingChatButton from './components/FloatingChatButton';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Todo App - Manage Your Tasks',
  description: 'An intelligent task management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        <AuthProvider>
          {/* Main Content */}
          {children}

          {/* Floating Chat Button - Global */}
          <FloatingChatButton />
        </AuthProvider>
      </body>
    </html>
  );
}