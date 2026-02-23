import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, BarChart3 } from "lucide-react";

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data: courses } = await supabase.from("courses").select("id, title").order("created_at", { ascending: false });
      const { data: enrollments } = await supabase.from("enrollments").select("course_id");
      const chart = (courses || []).slice(0, 10).map(c => ({
        name: c.title.slice(0, 12),
        enrollments: (enrollments || []).filter(e => e.course_id === c.id).length,
      }));
      setData(chart);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Analytics</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Platform analytics</h1>
            <p className="mt-2 text-sm text-muted-foreground">Visibility into enrollment demand by course.</p>
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Enrollments by course</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
