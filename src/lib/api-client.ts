
const API_URL = ''; // Use relative path since server serves both frontend and API

export const apiClient = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
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
