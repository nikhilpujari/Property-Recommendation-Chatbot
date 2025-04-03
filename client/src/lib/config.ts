// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://property-recommendation-chatbot.onrender.com';
console.log('API_BASE_URL from config:', API_BASE_URL);

// Use this to determine if we're in production
export const isProduction = import.meta.env.MODE === 'production';