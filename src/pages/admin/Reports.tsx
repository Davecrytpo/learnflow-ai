import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, LineChart, TrendingUp, Users, GraduationCap, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminReports = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    completedEnrollments: 0,
    certificatesIssued: 0,
    activeLearners: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      const [enrollRes, certRes] = await Promise.all([
        supabase.from("enrollments").select("status"),
        supabase.from("certificates").select("id")
      ]);

      const enrolls = enrollRes.data || [];
      const certs = certRes.data || [];

      setStats({
        totalEnrollments: enrolls.length,
        completedEnrollments: enrolls.filter(e => e.status === 'completed').length,
        activeLearners: enrolls.filter(e => e.status === 'active' || e.status === 'approved').length,
        certificatesIssued: certs.length
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Enrollments,${stats.totalEnrollments}\n`
      + `Active Learners,${stats.activeLearners}\n`
      + `Completed Courses,${stats.completedEnrollments}\n`
      + `Certificates Issued,${stats.certificatesIssued}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "learnflow_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "Report downloaded", description: "Your CSV export is ready." });
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Intelligence</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Executive Reports</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Real-time insights into platform adoption and learner success.
              </p>
            </div>
            <Button className="bg-gradient-brand text-primary-foreground shadow-lg shadow-primary/20" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export Summary
            </Button>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Enrollments</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
                <p className="text-xs text-muted-foreground">Lifetime registrations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Learners</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeLearners}</div>
                <p className="text-xs text-muted-foreground">Currently engaged</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
                <LineChart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalEnrollments > 0 ? Math.round((stats.completedEnrollments / stats.totalEnrollments) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Global average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Certificates</CardTitle>
                <GraduationCap className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.certificatesIssued}</div>
                <p className="text-xs text-muted-foreground">Credentials awarded</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Standard Reports</CardTitle>
            <CardDescription>Pre-configured datasets available for instant view.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Monthly User Growth", desc: "New registrations by week", status: "Live" },
                { title: "Course Popularity Index", desc: "Most viewed and enrolled courses", status: "Live" },
                { title: "Financial Transaction Log", desc: "Purchase history and revenue", status: "Restricted" }
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
                  <div>
                    <p className="font-semibold text-foreground">{r.title}</p>
                    <p className="text-sm text-muted-foreground">{r.desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={r.status === "Live" ? "default" : "secondary"}>{r.status}</Badge>
                    <Button variant="outline" size="sm">View Data</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
