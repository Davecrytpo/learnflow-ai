import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock } from "lucide-react";

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
    setLoading(true);
    try {
      const enrollRes = await api.get("/enrollments/me");
      const courseIds = (enrollRes.data || []).map((e: any) => e.course_id?._id);
      
      if (courseIds.length > 0) {
        const asgnRes = await api.get("/assignments");
        const filteredAsgns = (asgnRes.data || []).filter((a: any) => 
          courseIds.includes(a.course_id) && a.due_date
        );
        setDeadlines(filteredAsgns);
      }
    } catch (err) {
      console.error(err);
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
        
        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          <Card className="p-4">
            <CalendarUI
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow w-full flex justify-center"
              modifiers={{
                hasDeadline: (date) => deadlines.some(d => new Date(d.due_date).toDateString() === date.toDateString())
              }}
              modifiersClassNames={{
                hasDeadline: "bg-primary/10 text-primary font-bold underline"
              }}
            />
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Due on {date?.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : selectedDateDeadlines.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-8">
                    No deadlines for this date.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedDateDeadlines.map(d => (
                      <div key={d._id} className="rounded-lg border border-border p-3 space-y-1">
                        <p className="font-semibold text-sm">{d.title}</p>
                        <Badge variant="outline" className="text-[10px] mt-1">Assignment</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Monthly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Deadlines This Month</span>
                    <span className="font-bold">{deadlines.length}</span>
                  </div>
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
