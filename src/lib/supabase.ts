// API Configuration
// Add your new API keys to the .env file at the root of your project.
// The PUBLIC_ prefix is required by Astro to expose variables to client-side code.

export const API_CONFIG = {
  NEW_SERVICE_KEY: import.meta.env.PUBLIC_NEW_SERVICE_KEY || '',
  ANOTHER_API_KEY: import.meta.env.PUBLIC_ANOTHER_API_KEY || '',
  // Add more keys here as needed for your new features
};
