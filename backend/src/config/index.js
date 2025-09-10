import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  SERPER_API_KEY: process.env.SERPER_API_KEY,
  ORIGIN_ALLOWLIST: process.env.ORIGIN_ALLOWLIST || 'http://localhost:3000',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-pro'
};

export default config;
