
const API_URL = typeof window !== "undefined" ? window.location.origin : "http://localhost:8787";

export const apiClient = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(new URL(endpoint, API_URL).toString(), {
      ...options,
      headers,
    });

    const raw = await response.text();
    let data = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = { error: raw || 'Unexpected server response' };
    }

    if (!response.ok) {
      throw new Error(data?.error || 'Something went wrong');
    }

    return data;
  },

  auth: {
    async signup(userData: any) {
      return apiClient.fetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    async login(credentials: any) {
      const data = await apiClient.fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      return data;
    },

    async me() {
      return apiClient.fetch('/auth/me');
    },

    logout() {
      localStorage.removeItem('auth_token');
    }
  }
};
