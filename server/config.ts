import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * MANDATORY CENTRAL MODEL CONFIGURATION
 * Real Google Gemma 4 model explicitly configured as required.
 */
export const GEMMA_MODEL = 'gemma-4-26b-a4b-it';

// Server-side initialization following @google/genai guidelines
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});
