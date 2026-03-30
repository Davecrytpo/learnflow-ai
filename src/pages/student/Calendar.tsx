import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, AlertCircle } from "lucide-react";

const CalendarPage = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchDeadlines();
  }, [user]);

  const fetchDeadlines = async () => {
    try {
      setLoading(true);
      // Get enrolled course IDs
      const enrollRes = await apiClient.db
        .from("enrollments")
        .select("course_id")
        .eq("student_id", user?.id)
        .in("status", ["active", "approved", "completed"])
        .execute();
      
      const enrollments = enrollRes.data;
      
      if (enrollments && enrollments.length > 0) {
        const courseIds = enrollments.map((e: any) => e.course_id);
        const { data: assignments } = await apiClient.db
          .from("assignments")
          .select("*, courses(title)")
          .in("course_id", courseIds)
          .execute();
        
        // Filter those with due dates
        setDeadlines((assignments || []).filter((a: any) => a.due_date));
      }
    } catch (error) {
      console.error("Error fetching deadlines:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedDateDeadlines = deadlines.filter(d => {
    if (!date || !d.due_date) return false;
    const dueDate = new Date(d.due_date);
    return dueDate.toDateString() === date.toDateString();
  });

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Calendar</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Academic calendar</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Track deadlines and plan your learning week with a single view of everything due.
            </p>
          </div>
        </section>
        
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Card className="overflow-hidden border-none shadow-xl shadow-primary/5">
            <CardContent className="p-0 sm:p-6">
              <CalendarUI
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full flex justify-center"
                modifiers={{
                  hasDeadline: (date) => deadlines.some(d => new Date(d.due_date).toDateString() === date.toDateString())
                }}
                modifiersClassNames={{
                  hasDeadline: "bg-primary/10 text-primary font-bold underline"
                }}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  {date?.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : selectedDateDeadlines.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl bg-muted/30 border border-dashed">
                    <AlertCircle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No deadlines for this date.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateDeadlines.map(d => (
                      <div key={d.id} className="group rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className="font-semibold text-sm group-hover:text-primary transition-colors">{d.title}</p>
                            <p className="text-xs text-muted-foreground">{d.courses?.title}</p>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] shrink-0">Assignment</Badge>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Due at {new Date(d.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-80">Total Deadlines</span>
                    <span className="text-2xl font-bold">{deadlines.length}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full w-2/3" />
                  </div>
                  <p className="text-[10px] opacity-70">You have 3 deadlines approaching in the next 48 hours.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
