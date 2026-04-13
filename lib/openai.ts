import { createOpenAI } from '@ai-sdk/openai';

const openAiApiKey = process.env.OPENAI_API_KEY;

if (!openAiApiKey) {
  throw new Error('Missing OPENAI_API_KEY');
}

export const openai = createOpenAI({ apiKey: openAiApiKey });
