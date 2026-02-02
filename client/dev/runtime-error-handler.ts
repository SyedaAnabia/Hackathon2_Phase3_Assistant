'use client';

export function registerErrorHandler(handler: (error: Error) => void) {
  window.addEventListener('error', (event) => {
    handler(event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    handler(event.reason);
  });
}