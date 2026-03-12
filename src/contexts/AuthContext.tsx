import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type AppRole = "admin" | "instructor" | "student";

interface AuthContextType {
  user: User | null;
  role: AppRole | null;
  loading: boolean;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  refreshRole: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);

  const fetchRole = useCallback(async (userId: string, email?: string) => {
    setRoleLoading(true);
    try {
      // 1. Admin Overrides
      if (email === "admin@globaluniversityinstitute.com") {
        setRole("admin");
        return;
      }

      // 2. Check Database Role
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (error) throw error;

      if (data?.role) {
        setRole(data.role as AppRole);
      } else {
        // 3. Fallback: If no role in DB, check metadata or default to student
        const { data: { user: freshUser } } = await supabase.auth.getUser();
        const metaRole = freshUser?.user_metadata?.role;
        setRole((metaRole as AppRole) || "student");
      }
    } catch (err) {
      console.error("Auth: Role fetch failed, defaulting to student.", err);
      setRole("student");
    } finally {
      setRoleLoading(false);
    }
  }, []);

  const refreshRole = useCallback(async () => {
    if (!user) return;
    await fetchRole(user.id, user.email);
  }, [user, fetchRole]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchRole(currentUser.id, currentUser.email);
      } else {
        setRole(null);
      }
      setAuthLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchRole(currentUser.id, currentUser.email);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchRole]);

  // If we have a user but no role yet, we are still loading
  const loading = authLoading || (user && !role && roleLoading);

  return (
    <AuthContext.Provider value={{ user, role, loading, refreshRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
