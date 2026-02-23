import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, BarChart3 } from "lucide-react";

const InstructorAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: courses } = await supabase
        .from("courses")
        .select("id, title")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      const courseIds = (courses || []).map((c) => c.id);
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("id, course_id")
        .in("course_id", courseIds);

      const data = (courses || []).slice(0, 8).map((c) => ({
        name: c.title.slice(0, 12),
        students: (enrollments || []).filter((e) => e.course_id === c.id).length,
      }));
      setChartData(data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Analytics</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Instructor analytics</h1>
            <p className="mt-2 text-sm text-muted-foreground">Track enrollment trends across your courses.</p>
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Enrollment by course</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InstructorAnalytics;
