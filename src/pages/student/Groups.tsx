import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const StudentGroups = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const [membershipRes, groupRes, enrollmentRes] = await Promise.all([
        apiClient.db.from("group_members").select("*").eq("student_id", user.id).execute(),
        apiClient.db.from("course_groups").select("*").order("created_at", { ascending: false }).execute(),
        apiClient.fetch("/enrollments/me")
      ]);
      const groupIds = (membershipRes.data || []).map((m: any) => m.group_id);
      if (groupIds.length === 0) {
        setGroups([]);
        setLoading(false);
        return;
      }
      const courseMap = new Map((enrollmentRes || []).map((e: any) => [e.course_id?._id || e.course_id, e.course_id?.title || "Untitled Course"]));
      const data = (groupRes.data || [])
        .filter((g: any) => groupIds.includes(g.id))
        .map((g: any) => ({ ...g, courses: { title: courseMap.get(g.course_id) || "Course Group" } }));
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
