/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  // Base URL - change based on environment
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  
  // Timeout in milliseconds
  TIMEOUT: 10000,
  
  // Common headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // API endpoints
  ENDPOINTS: {
    AUTH: '/api/auth',
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    RECORD: '/api/records',
  },
};

// Environment-specific configurations
export const ENV = {
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
};