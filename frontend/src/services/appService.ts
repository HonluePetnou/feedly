import { env } from '../config/env';

const API_URL = env.apiUrl;

// Types
export interface App {
  id: number;
  package_name: string;
  name: string | null;
  icon_url: string | null;
  last_scraped: string | null;
}

export interface AppDetail {
  id: number;
  package_name: string;
  name: string | null;
  icon_url: string | null;
  created_at: string;
  last_scraped: string | null;
  nb_reviews: number;
}

export interface AppAnalytics {
  average_rating: number | null;
  rating_distribution: Record<number, number>;
  sentiments: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface Review {
  date: string;
  rating: number;
  user: string | null;
  content: string | null;
  sentiment: number | null;
}

export interface DashboardStats {
  total_apps: number;
  total_reviews: number;
  average_rating: number;
  sentiment_distribution: {
    positive_pct: number;
    negative_pct: number;
    neutral_pct: number;
    positive_count: number;
    negative_count: number;
    neutral_count: number;
  };
  recent_activity: {
    id: number;
    app_name: string;
    app_icon: string | null;
    rating: number;
    content: string | null;
    date: string;
    sentiment: number | null;
  }[];
}

// Helper pour les requêtes authentifiées
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const appService = {
  // List all applications
  async getApps(): Promise<App[]> {
    const res = await fetch(`${API_URL}/applications`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      throw new Error('Failed to load applications');
    }
    
    return res.json();
  },

  // Get application details
  async getApp(id: number): Promise<AppDetail> {
    const res = await fetch(`${API_URL}/applications/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      throw new Error('Failed to load application');
    }
    
    return res.json();
  },

  // Add application (by package name, URL, or name)
  async addApp(appId: string, country: string = 'fr', count: number = 200): Promise<{ status: string; message: string; resolved_id: string }> {
    const res = await fetch(`${API_URL}/add-app`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ app_id: appId, country, count }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to add application');
    }
    
    return res.json();
  },

  // Update application
  async updateApp(id: number, data: { name?: string; icon_url?: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/applications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error('Failed to update application');
    }
    
    return res.json();
  },

  // Delete application
  async deleteApp(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/applications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      throw new Error('Failed to delete application');
    }
  },

  // Get application reviews
  async getReviews(id: number, limit: number = 100): Promise<Review[]> {
    const res = await fetch(`${API_URL}/applications/${id}/comments?limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      throw new Error('Failed to load reviews');
    }
    
    return res.json();
  },

  // Get application analytics
  async getAnalytics(id: number): Promise<AppAnalytics> {
    const res = await fetch(`${API_URL}/applications/${id}/analytics`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      throw new Error('Failed to load analytics');
    }
    
    return res.json();
  },

  // Get global dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_URL}/dashboard/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error("Failed to load dashboard stats");
    }

    return res.json();
  },
};
