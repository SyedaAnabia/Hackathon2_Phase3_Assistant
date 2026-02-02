// frontend/app/components/ProtectedRoute.tsx

'use client';

import { useAuth } from '../../lib/authContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional fallback component for unauthenticated users
}

const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If user is not authenticated and not loading, redirect to login
    if (!loading && !isAuthenticated && pathname !== '/auth/login') {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router, pathname]);

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // If user is authenticated, show the protected content
  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  // If not authenticated and no fallback provided, return null
  // (the redirect effect should handle navigation)
  return fallback || <div className="flex justify-center items-center h-screen">Redirecting to login...</div>;
};

export default ProtectedRoute;