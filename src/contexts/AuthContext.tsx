import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { apiClient } from "@/lib/api-client";

export type AppRole = "admin" | "instructor" | "student";

export interface User {
  id: string;
  email: string;
  display_name?: string;
  role: AppRole;
  avatar_url?: string;
  email_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  role: AppRole | null;
  loading: boolean;
  refreshRole: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  refreshRole: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await apiClient.auth.me();
      setUser(userData);
    } catch (err) {
      console.error("Auth: Failed to fetch user", err);
      localStorage.removeItem("auth_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRole = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const logout = useCallback(() => {
    apiClient.auth.logout();
    setUser(null);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const role = user?.role || null;

  return (
    <AuthContext.Provider value={{ user, role, loading, refreshRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
