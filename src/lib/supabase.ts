// API Configuration
// Add your new API keys to the .env file at the root of your project.
// The PUBLIC_ prefix is required by Astro to expose variables to client-side code.

export const API_CONFIG = {
  EARNINGS_FEED_API_KEY: import.meta.env.PUBLIC_EARNINGS_FEED_API_KEY || 'ef_B49t49ZYLKxASnVCTXHsOvteKp_nclOY',
  OCR_SPACE_API_KEY: import.meta.env.PUBLIC_OCR_SPACE_API_KEY || 'K81621063188957',
  RAPIDAPI_KEY: import.meta.env.PUBLIC_RAPIDAPI_KEY || 'd47a375ca7mshe190c302cf06b22p15b99fjsn796c079b0e86',
};
