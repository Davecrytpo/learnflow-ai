import { useAuthContext } from "@/contexts/AuthContext";
import type { User } from "@supabase/supabase-js";

export function useAuth(): { user: User | null; loading: boolean } {
  const { user, loading } = useAuthContext();
  return { user, loading };
}
