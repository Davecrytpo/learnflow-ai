import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, LineChart, TrendingUp, Users, Loader2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

const AdminReports = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingCourses: 0,
    pendingEnrollments: 0,
    activeInstructors: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await apiClient.fetch("/admin/stats");
        setStats({
          totalStudents: data.users || 0,
          totalCourses: data.courses || 0,
          totalEnrollments: data.enrollments || 0,
          pendingCourses: data.pendingCourses || 0,
          pendingEnrollments: data.pendingEnr || 0,
          activeInstructors: data.activeInstructors || 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Metric,Value\n"
      + `Total Students,${stats.totalStudents}\n`
      + `Active Instructors,${stats.activeInstructors}\n`
      + `Total Courses,${stats.totalCourses}\n`
      + `Total Enrollments,${stats.totalEnrollments}\n`
      + `Pending Courses,${stats.pendingCourses}\n`
      + `Pending Enrollments,${stats.pendingEnrollments}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "learnflow_admin_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Report downloaded" });
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Reporting</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Executive reports</h1>
              <p className="mt-2 text-sm text-muted-foreground">Export live operational data from the admin backend.</p>
            </div>
            <Button className="bg-gradient-brand text-primary-foreground shadow-lg shadow-primary/20" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export summary
            </Button>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Students</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">Registered learners</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Instructors</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeInstructors}</div>
                <p className="text-xs text-muted-foreground">Active faculty accounts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <p className="text-xs text-muted-foreground">Published and pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Enrollments</CardTitle>
                <LineChart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
                <p className="text-xs text-muted-foreground">Platform-wide enrollment records</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Operational queues</CardTitle>
            <CardDescription>High-priority approval and verification counts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Pending course approvals", value: stats.pendingCourses },
              { title: "Pending enrollment verifications", value: stats.pendingEnrollments }
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-4">
                <p className="font-semibold text-foreground">{item.title}</p>
                <span className="text-lg font-bold">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
