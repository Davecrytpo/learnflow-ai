import { useAuthContext, AppRole } from "@/contexts/AuthContext";

interface User {
  id: string;
  email: string;
  role: AppRole;
  display_name?: string;
  avatar_url?: string;
}

export function useAuth(): { user: User | null; role: AppRole | null; loading: boolean } {
  const { user, role, loading } = useAuthContext();
  return { user, role, loading };
}
