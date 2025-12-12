import { env } from '../config/env';

const API_URL = env.apiUrl;

// Types
export interface User {
  id: number;
  fullname: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterData {
  fullname: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

// Cookie helpers
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

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

// Service d'authentification
export const authService = {
  // Register
  async register(data: RegisterData): Promise<{ message: string; user_id: number }> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Registration failed');
    }
    
    return res.json();
  },

  // Login
  async login(data: LoginData): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Login failed');
    }
    
    const response: AuthResponse = await res.json();
    
    // Store token in both localStorage and cookie (for middleware)
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setCookie('access_token', response.access_token, 7);
    
    return response;
  },

  // Verify OTP
  async verifyOTP(data: VerifyOTPData): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'OTP verification failed');
    }
    
    return res.json();
  },

  // Resend OTP
  async resendOTP(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: '' }), // password not used for resend
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to resend OTP');
    }
    
    return res.json();
  },

  // Forgot Password - Request OTP
  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to send reset code');
    }
    
    return res.json();
  },

  // Reset Password with OTP
  async resetPassword(data: { email: string; otp: string; new_password: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to reset password');
    }
    
    return res.json();
  },

  // Get current user
  async getMe(): Promise<User> {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      throw new Error('Not authenticated');
    }
    
    return res.json();
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      deleteCookie('access_token');
    }
  },

  // Update profile
  async updateProfile(data: { fullname: string; email: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Update failed');
    }
    
    return res.json();
  },

  // Update password
  async updatePassword(data: { current_password: string; new_password: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/auth/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Password update failed');
    }
    
    return res.json();
  },

  // Delete account
  async deleteAccount(): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/auth/account`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Delete failed');
    }
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
    return res.json();
  },

  // Check if logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  },

  // Get stored user
  getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  },
};
