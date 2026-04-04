// API Configuration
// Add your new API keys to the .env file at the root of your project.
// The PUBLIC_ prefix is required by Astro to expose variables to client-side code.

export const API_CONFIG = {
  CONVERSION_TOOLS_API_KEY: import.meta.env.PUBLIC_CONVERSION_TOOLS_API_KEY || '',
  EARNINGS_FEED_API_KEY: import.meta.env.PUBLIC_EARNINGS_FEED_API_KEY || '',
  OCR_SPACE_API_KEY: import.meta.env.PUBLIC_OCR_SPACE_API_KEY || '',
  RAPIDAPI_KEY: import.meta.env.PUBLIC_RAPIDAPI_KEY || '',
};
