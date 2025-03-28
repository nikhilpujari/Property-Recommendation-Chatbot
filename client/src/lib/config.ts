// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://7f17df2b-5925-4de5-a570-94505fb5c030-00-2yovi3oly721k.janeway.replit.dev';
console.log('API_BASE_URL from config:', API_BASE_URL);

// Use this to determine if we're in production
export const isProduction = import.meta.env.MODE === 'production';