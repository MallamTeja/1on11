import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export const config = {
  gemini: {
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  },
  serper: {
    apiKey: process.env.NEXT_PUBLIC_SERPER_API_KEY || '',
  },
  deepseek: {
    apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || '',
  },
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || '',
  },
};
