import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

const cohorts = [
  { id: "CI-11", name: "Spring Cohort A", completion: "78%", retention: "92%" },
  { id: "CI-09", name: "Spring Cohort B", completion: "84%", retention: "95%" },
  { id: "CI-07", name: "Spring Cohort C", completion: "61%", retention: "88%" },
];

const AdminCohortInsights = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Cohort Insights</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Cohort performance</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Compare completion, retention, and satisfaction across cohorts.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <BarChart3 className="mr-2 h-4 w-4" /> Export insights
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active cohorts</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8</p>
            <p className="text-xs text-muted-foreground">Across campuses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg completion</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">78%</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">78%</p>
            <p className="text-xs text-muted-foreground">This term</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Retention</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">92%</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">92%</p>
            <p className="text-xs text-muted-foreground">Rolling 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {cohorts.map((cohort) => (
          <Card key={cohort.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{cohort.name}</p>
                <p className="text-xs text-muted-foreground">Completion {cohort.completion}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className="bg-primary/10 text-primary" variant="secondary">{cohort.retention} retention</Badge>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default AdminCohortInsights;
