import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import api from "@/lib/api";

export type AppRole = "admin" | "instructor" | "student";

interface User {
  id: string;
  email: string;
  role: AppRole;
  display_name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  role: AppRole | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  refreshUser: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("gui_auth_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (err) {
      console.error("Auth: Failed to fetch user profile", err);
      localStorage.removeItem("gui_auth_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(() => {
    localStorage.removeItem("gui_auth_token");
    setUser(null);
  }, []);

  const role = user?.role || null;

  return (
    <AuthContext.Provider value={{ user, role, loading, refreshUser: fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
