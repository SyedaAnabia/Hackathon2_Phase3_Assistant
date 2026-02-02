// frontend/src/lib/authServiceSelector.ts

import { authService } from './authService';
import { mockAuthService } from './mockAuthService';

// Determine which service to use based on environment
// Default to mock service to work without backend
const USE_MOCK_SERVICE = process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'false';

export const authServiceToUse = USE_MOCK_SERVICE ? mockAuthService : authService;