import { useAuthContext, type User } from "@/contexts/AuthContext";

export function useAuth(): { user: User | null; loading: boolean } {
  const { user, loading } = useAuthContext();
  return { user, loading };
}
