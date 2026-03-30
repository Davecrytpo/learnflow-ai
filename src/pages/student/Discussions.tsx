import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Loader2, BookOpen } from "lucide-react";
import DiscussionBoard from "@/components/discussion/DiscussionBoard";

const StudentDiscussions = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchEnrollments = async () => {
      try {
        const { data } = await apiClient.db
          .from("enrollments")
          .select("*, courses(title)")
          .eq("student_id", user.id)
          .in("status", ["active", "approved", "completed"])
          .execute();
        
        const enrs = data || [];
        setEnrollments(enrs);
        if (enrs.length > 0) {
          setSelectedCourseId(enrs[0].course_id);
        }
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [user]);

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Discussions</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Join the learning community</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask questions, share takeaways, and learn from peers.
            </p>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : enrollments.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground italic">You are not enrolled in any courses yet.</p>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="space-y-6">
              {selectedCourseId ? (
                <DiscussionBoard courseId={selectedCourseId} />
              ) : (
                <Card className="p-12 text-center text-muted-foreground italic">
                  Select a course to view discussions.
                </Card>
              )}
            </div>

            <div className="space-y-4 order-first lg:order-last">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Your Courses
              </h3>
              <div className="space-y-2">
                {enrollments.map((enr) => (
                  <button
                    key={enr.id}
                    onClick={() => setSelectedCourseId(enr.course_id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedCourseId === enr.course_id
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="text-sm font-medium line-clamp-1">{enr.courses?.title}</p>
                    <Badge variant="secondary" className="mt-2 text-[10px]">
                      {selectedCourseId === enr.course_id ? "Viewing" : "Select"}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDiscussions;
