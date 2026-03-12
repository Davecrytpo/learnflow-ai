import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen } from "lucide-react";

const StudentGroups = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: memberships } = await (supabase.from as any)("group_members")
        .select("group_id")
        .eq("student_id", user.id);
      const groupIds = (memberships || []).map((m: any) => m.group_id);
      if (groupIds.length === 0) {
        setGroups([]);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("course_groups")
        .select("*, courses(title)")
        .in("id", groupIds)
        .order("created_at", { ascending: false });
      setGroups(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Groups</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Your cohorts</h1>
            <p className="mt-2 text-sm text-muted-foreground">Group-based learning and discussions.</p>
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Group membership</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : groups.length === 0 ? (
              <p className="text-sm text-muted-foreground">No groups yet.</p>
            ) : (
              <div className="space-y-2">
                {groups.map(g => (
                  <div key={g.id} className="rounded-xl border border-border p-3 text-sm">
                    <p className="font-medium text-foreground">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.courses?.title}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentGroups;
