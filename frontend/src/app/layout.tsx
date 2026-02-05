// frontend/src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import ToastContainer from '@/components/ToastContainer';
import ClientWrapper from './ClientWrapper';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo Assistant',
  description: 'A smart todo application with AI assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientWrapper>
            {children}
            <ToastContainer />
          </ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}