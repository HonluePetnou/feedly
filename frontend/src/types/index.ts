export * from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Review {
  id: string;
  appId: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}
