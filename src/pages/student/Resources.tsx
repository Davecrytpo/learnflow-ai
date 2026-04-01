import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const StudentResources = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const [enrollments, resourceRes] = await Promise.all([
        apiClient.fetch("/enrollments/me"),
        apiClient.db.from("course_resources").select("*").order("created_at", { ascending: false }).execute()
      ]);
      const courseIds = (enrollments || []).map((e: any) => e.course_id?._id || e.course_id);
      if (courseIds.length === 0) {
        setResources([]);
        setLoading(false);
        return;
      }
      const courses = new Map((enrollments || []).map((e: any) => [e.course_id?._id || e.course_id, e.course_id?.title || "Untitled Course"]));
      const filtered = (resourceRes.data || [])
        .filter((item: any) => courseIds.includes(item.course_id))
        .map((item: any) => ({ ...item, courses: { title: courses.get(item.course_id) || "Untitled Course" } }));
      setResources(filtered);
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Resources</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Course resources</h1>
            <p className="mt-2 text-sm text-muted-foreground">Links and materials shared by your instructors.</p>
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">All resources</CardTitle>
            <LinkIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : resources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No resources yet.</p>
            ) : (
              <div className="space-y-2">
                {resources.map(r => (
                  <div key={r.id} className="rounded-xl border border-border p-3 text-sm">
                    <p className="text-xs text-muted-foreground">{r.courses?.title}</p>
                    <p className="font-medium text-foreground">{r.title}</p>
                    <a href={r.url} className="text-xs text-primary hover:underline" target="_blank" rel="noreferrer">{r.url}</a>
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

export default StudentResources;
