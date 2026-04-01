import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Megaphone } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const StudentAnnouncements = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const [enrollmentRes, announcementRes] = await Promise.all([
        apiClient.fetch("/enrollments/me"),
        apiClient.fetch("/announcements?limit=50")
      ]);
      const courseIds = (enrollmentRes || []).map((e: any) => e.course_id?._id || e.course_id);
      if (courseIds.length === 0) {
        setAnnouncements([]);
        setLoading(false);
        return;
      }
      const filtered = (announcementRes || []).filter((item: any) => courseIds.includes(item.course_id?._id || item.course_id));
      setAnnouncements(filtered || []);
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Announcements</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Course announcements</h1>
            <p className="mt-2 text-sm text-muted-foreground">Updates from instructors in your enrolled courses.</p>
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Latest updates</CardTitle>
            <Megaphone className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No announcements yet.</p>
            ) : (
              <div className="space-y-2">
                {announcements.map(a => (
                  <div key={a.id} className="rounded-xl border border-border p-3 text-sm">
                    <p className="text-xs text-muted-foreground">{a.course_id?.title || a.courses?.title}</p>
                    <p className="font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{a.content || a.body || ""}</p>
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

export default StudentAnnouncements;
