import { env } from '../config/env';

const API_URL = env.apiUrl;

// Types
export interface Message {
  id: number;
  role: 'user' | 'bot';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  app_id: number;
  app_name: string | null;
  app_icon: string | null;
  last_message: string | null;
  updated_at: string;
}

export interface ConversationDetail {
  id: number;
  app_id: number;
  app_name: string | null;
  app_icon: string | null;
  messages: Message[];
}

// Helper to get cookie
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!);
  return null;
};

// Helper pour les requêtes authentifiées
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? (localStorage.getItem('access_token') || getCookie('access_token')) : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const chatService = {
  // List all conversations
  async getConversations(): Promise<Conversation[]> {
    const res = await fetch(`${API_URL}/chat/conversations`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      throw new Error('Failed to load conversations');
    }
    
    return res.json();
  },

  // Get conversation with messages
  async getConversation(conversationId: number): Promise<ConversationDetail> {
    const res = await fetch(`${API_URL}/chat/conversations/${conversationId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      throw new Error('Failed to load conversation');
    }
    
    return res.json();
  },

  // Create new conversation
  async createConversation(appId: number): Promise<Conversation> {
    const res = await fetch(`${API_URL}/chat/conversations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ app_id: appId }),
    });
    
    if (!res.ok) {
      throw new Error('Failed to create conversation');
    }
    
    return res.json();
  },

  // Send message and get response
  async sendMessage(conversationId: number, content: string): Promise<Message> {
    const res = await fetch(`${API_URL}/chat/conversations/${conversationId}/message`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    
    if (!res.ok) {
      throw new Error('Failed to send message');
    }
    
    return res.json();
  },

  // Delete conversation
  async deleteConversation(conversationId: number): Promise<void> {
    const res = await fetch(`${API_URL}/chat/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      throw new Error('Failed to delete conversation');
    }
  },
};
