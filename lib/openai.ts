import OpenAI from 'openai';

const openAiApiKey = process.env.OPENAI_API_KEY;

if (!openAiApiKey) {
  throw new Error('Missing OPENAI_API_KEY');
}

export const openai = new OpenAI({ apiKey: openAiApiKey });
