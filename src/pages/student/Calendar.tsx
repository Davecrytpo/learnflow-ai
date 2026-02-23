import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar as CalendarIcon, Clock } from "lucide-react";

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
    // Get enrolled course IDs
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("student_id", user?.id);
    
    if (enrollments && enrollments.length > 0) {
      const courseIds = enrollments.map(e => e.course_id);
      const { data: assignments } = await supabase
        .from("assignments")
        .select("*, courses(title)")
        .in("course_id", courseIds)
        .not("due_date", "is", null);
      
      setDeadlines(assignments || []);
    }
    setLoading(false);
  };

  const selectedDateDeadlines = deadlines.filter(d => {
    if (!date || !d.due_date) return false;
    const dueDate = new Date(d.due_date);
    return dueDate.toDateString() === date.toDateString();
  });

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Academic Calendar</h1>
        
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
                hasDeadline: "bg-destructive/10 text-destructive font-bold underline"
              }}
            />
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
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
                      <div key={d.id} className="rounded-lg border border-border p-3 space-y-1">
                        <p className="font-semibold text-sm">{d.title}</p>
                        <p className="text-xs text-muted-foreground">{d.courses?.title}</p>
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
