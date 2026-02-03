import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../src/contexts/AuthContext';
import FloatingChatButton from './components/FloatingChatButton';

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'Manage your tasks efficiently',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="%23FFFFFF" stroke-width="2"/><polyline points="14,2 14,8 20,8" stroke="%23FFFFFF" stroke-width="2"/><line x1="16" y1="13" x2="8" y2="13" stroke="%23FFFFFF" stroke-width="2"/><line x1="16" y1="17" x2="8" y2="17" stroke="%23FFFFFF" stroke-width="2"/><polyline points="10,9 9,9 8,9" stroke="%23FFFFFF" stroke-width="2"/></svg>',
        href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="%23FFFFFF" stroke-width="2"/><polyline points="14,2 14,8 20,8" stroke="%23FFFFFF" stroke-width="2"/><line x1="16" y1="13" x2="8" y2="13" stroke="%23FFFFFF" stroke-width="2"/><line x1="16" y1="17" x2="8" y2="17" stroke="%23FFFFFF" stroke-width="2"/><polyline points="10,9 9,9 8,9" stroke="%23FFFFFF" stroke-width="2"/></svg>',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <FloatingChatButton />
        </AuthProvider>
      </body>
    </html>
  );
}