import { useAuthContext } from "@/contexts/AuthContext";

export type AppRole = "admin" | "instructor" | "student";

export function useUserRole(): { role: AppRole | null; loading: boolean } {
  const { role, loading } = useAuthContext();
  return { role, loading };
}
