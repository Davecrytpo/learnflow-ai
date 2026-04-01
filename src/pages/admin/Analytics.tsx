import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, BarChart3, Users, BookOpen } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [chart, summary] = await Promise.all([
          apiClient.fetch("/instructor/analytics/enrollments"),
          apiClient.fetch("/admin/stats")
        ]);
        setData(chart || []);
        setStats(summary || { users: 0, courses: 0, enrollments: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6 pb-20">
        <section className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/70 bg-card/90 p-6 md:p-8 shadow-sm">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative">
            <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-primary">Analytics</p>
            <h1 className="mt-2 font-display text-2xl md:text-3xl font-bold text-foreground">Platform analytics</h1>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground">Live metrics from the current backend data store.</p>
          </div>
        </section>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Students</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="text-2xl md:text-3xl font-bold">{stats.users}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="text-2xl md:text-3xl font-bold">{stats.courses}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Enrollments</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="text-2xl md:text-3xl font-bold">{stats.enrollments}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-6">
            <div>
              <CardTitle className="text-lg md:text-xl">Enrollments by course</CardTitle>
              <p className="text-xs text-muted-foreground">Visualizing student distribution across the curriculum.</p>
            </div>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="p-2 md:p-6">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data}>
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

export default AdminAnalytics;
