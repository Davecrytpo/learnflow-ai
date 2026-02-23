import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

const cohorts = [
  { id: "CH-01", name: "Spring Cohort A", completion: "78%", risk: "Medium" },
  { id: "CH-02", name: "Spring Cohort B", completion: "84%", risk: "Low" },
  { id: "CH-03", name: "Spring Cohort C", completion: "61%", risk: "High" },
];

const badgeFor = (risk: string) => {
  if (risk === "Low") return "bg-emerald-500/10 text-emerald-600";
  if (risk === "Medium") return "bg-amber-500/10 text-amber-600";
  return "bg-destructive/10 text-destructive";
};

const InstructorCohortHeatmap = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Cohort Heatmap</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Performance signals</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Identify at-risk cohorts and target interventions.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Activity className="mr-2 h-4 w-4" /> Export heatmap
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cohorts</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">6</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">At risk</CardTitle>
            <Badge className="bg-destructive/10 text-destructive" variant="secondary">2</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg completion</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">76%</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">76%</p>
            <p className="text-xs text-muted-foreground">This term</p>
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
                <Badge className={badgeFor(cohort.risk)} variant="secondary">{cohort.risk}</Badge>
                <Button size="sm" variant="outline">Open</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default InstructorCohortHeatmap;
