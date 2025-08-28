"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// Load environment variables from .env file
require('dotenv').config({ path: '../../.env' });
exports.config = {
    gemini: {
        apiKey: process.env.GEMINI_API_KEY || '',
    },
    serper: {
        apiKey: process.env.SERPER_API_KEY || '',
    },
    deepseek: {
        apiKey: process.env.DEEPSEEK_API_KEY || '',
    },
    youtube: {
        apiKey: process.env.YOUTUBE_API_KEY || '',
    },
};
