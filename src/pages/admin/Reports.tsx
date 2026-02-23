import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Download, LineChart, TrendingUp } from "lucide-react";

const reports = [
  { id: "R-2026-02", title: "Monthly Learning Outcomes", scope: "All programs", status: "Ready" },
  { id: "R-2026-01", title: "Cohort Completion Analysis", scope: "Q1 cohorts", status: "Ready" },
  { id: "R-2025-12", title: "Engagement Drop-off Report", scope: "Enterprise clients", status: "Scheduled" },
];

const badgeFor = (status: string) => {
  if (status === "Ready") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminReports = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Reports</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Executive reporting</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Generate insights across cohorts, courses, and enterprise clients.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Download className="mr-2 h-4 w-4" /> Export bundle
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active reports</CardTitle>
            <LineChart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Across orgs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">4</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Engagement trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">+14%</p>
            <p className="text-xs text-muted-foreground">30-day delta</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Report library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Search reports" className="max-w-xs" />
            <Button variant="outline">Filter</Button>
            <Button variant="ghost">Schedule</Button>
          </div>
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{report.title}</p>
                  <p className="text-xs text-muted-foreground">{report.scope}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <Badge className={badgeFor(report.status)} variant="secondary">{report.status}</Badge>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminReports;
