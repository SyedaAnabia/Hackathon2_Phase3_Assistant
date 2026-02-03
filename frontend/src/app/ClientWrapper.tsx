// frontend/src/app/ClientWrapper.tsx
'use client';

import { useState, useEffect } from 'react';
import FloatingChatButton from '@/components/FloatingChatButton';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Don't render anything on the server or until mounted
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <FloatingChatButton />
    </>
  );
}