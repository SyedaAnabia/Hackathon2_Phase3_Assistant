// frontend/src/lib/toastUtils.ts

/**
 * Toast notification utilities
 */

export interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', options: ToastOptions = {}) => {
  const { duration = 3000, position = 'top-right' } = options;
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `
    fixed z-50 px-4 py-2 rounded-md shadow-lg text-white font-medium
    transform transition-transform duration-300 ease-in-out
    ${getPositionClass(position)}
    ${getTypeClass(type)}
  `;
  toast.textContent = message;
  
  // Add to DOM
  document.body.appendChild(toast);
  
  // Trigger entrance animation
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0) translateY(0)';
  }, 10);
  
  // Remove after duration
  setTimeout(() => {
    toast.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    toast.style.transform = getExitTransform(position);
    toast.style.opacity = '0';
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
};

const getPositionClass = (position: ToastOptions['position']): string => {
  switch (position) {
    case 'top-right':
      return 'top-4 right-4';
    case 'top-left':
      return 'top-4 left-4';
    case 'bottom-right':
      return 'bottom-4 right-4';
    case 'bottom-left':
      return 'bottom-4 left-4';
    default:
      return 'top-4 right-4';
  }
};

const getTypeClass = (type: 'success' | 'error' | 'info'): string => {
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

const getExitTransform = (position: ToastOptions['position']): string => {
  switch (position) {
    case 'top-right':
    case 'bottom-right':
      return 'translateX(100%) translateY(0)';
    case 'top-left':
    case 'bottom-left':
      return 'translateX(-100%) translateY(0)';
    default:
      return 'translateX(100%) translateY(0)';
  }
};