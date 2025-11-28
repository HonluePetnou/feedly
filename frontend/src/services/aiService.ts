import { apiService } from './apiService';

export const aiService = {
  analyzeSentiment: (text: string) => {
    return apiService.post('/ai/sentiment', { text });
  },
  generateResponse: (prompt: string) => {
    return apiService.post('/ai/generate', { prompt });
  },
};
