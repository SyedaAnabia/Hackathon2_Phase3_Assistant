// frontend/src/components/ToastContainer.tsx

import { useEffect, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: CustomEvent) => {
      const { message, type, duration } = e.detail;
      const id = Math.random().toString(36).substr(2, 9);
      
      const newToast: Toast = {
        id,
        message,
        type: type || 'info',
        duration: duration || 3000
      };
      
      setToasts(prev => [...prev, newToast]);
      
      // Remove toast after duration
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration || 3000);
    };

    window.addEventListener('showToast', handleToastEvent as EventListener);
    
    return () => {
      window.removeEventListener('showToast', handleToastEvent as EventListener);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            px-4 py-2 rounded-md shadow-lg text-white font-medium
            transform transition-all duration-300 ease-in-out
            ${getToastClass(toast.type)}
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

const getToastClass = (type: 'success' | 'error' | 'info') => {
  switch (type) {
    case 'success':
      return 'bg-green-500';
    case 'error':
      return 'bg-red-500';
    case 'info':
      return 'bg-blue-500';
    default:
      return 'bg-blue-500';
  }
};

export default ToastContainer;