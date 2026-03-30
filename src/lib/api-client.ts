
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
  },

  db: {
    from(table: string) {
      return {
        select(columns: string = '*') {
          let _filters: any[] = [];
          let _order: any = null;
          let _limit: number | null = null;
          let _single = false;

          const builder = {
            eq(column: string, value: any) {
              _filters.push({ column, value, type: 'eq' });
              return builder;
            },
            in(column: string, values: any[]) {
              _filters.push({ column, value: values, type: 'in' });
              return builder;
            },
            order(column: string, { ascending = true } = {}) {
              _order = { column, ascending };
              return builder;
            },
            limit(count: number) {
              _limit = count;
              return builder;
            },
            single() {
              _single = true;
              return this.execute();
            },
            async execute() {
              const res = await apiClient.fetch(`/db/query/${table}`, {
                method: 'POST',
                body: JSON.stringify({
                  operation: 'select',
                  filters: _filters,
                  order: _order,
                  limit: _limit,
                  options: { single: _single }
                }),
              });
              return res;
            },
            // Add thenable support for await
            then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
              return this.execute().then(onfulfilled, onrejected);
            }
          };
          return builder;
        },

        insert(payload: any) {
          return {
            async execute() {
              return apiClient.fetch(`/db/query/${table}`, {
                method: 'POST',
                body: JSON.stringify({
                  operation: 'insert',
                  payload,
                  options: { single: !Array.isArray(payload) }
                }),
              });
            },
            then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
              return this.execute().then(onfulfilled, onrejected);
            }
          };
        },

        update(payload: any) {
          let _filters: any[] = [];
          const builder = {
            eq(column: string, value: any) {
              _filters.push({ column, value, type: 'eq' });
              return builder;
            },
            async execute() {
              return apiClient.fetch(`/db/query/${table}`, {
                method: 'POST',
                body: JSON.stringify({
                  operation: 'update',
                  filters: _filters,
                  payload
                }),
              });
            },
            then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
              return this.execute().then(onfulfilled, onrejected);
            }
          };
          return builder;
        },

        delete() {
          let _filters: any[] = [];
          const builder = {
            eq(column: string, value: any) {
              _filters.push({ column, value, type: 'eq' });
              return builder;
            },
            async execute() {
              return apiClient.fetch(`/db/query/${table}`, {
                method: 'POST',
                body: JSON.stringify({
                  operation: 'delete',
                  filters: _filters
                }),
              });
            },
            then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
              return this.execute().then(onfulfilled, onrejected);
            }
          };
          return builder;
        }
      };
    }
  }
};
