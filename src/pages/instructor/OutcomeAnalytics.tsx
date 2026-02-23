import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

const outcomes = [
  { id: "OA-01", outcome: "Problem framing", mastery: "82%", trend: "+6%" },
  { id: "OA-02", outcome: "Market sizing", mastery: "69%", trend: "+3%" },
  { id: "OA-03", outcome: "Experiment design", mastery: "76%", trend: "+5%" },
];

const InstructorOutcomeAnalytics = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Outcome Analytics</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Learning outcomes</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Track mastery levels and outcome progress across cohorts.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <BarChart3 className="mr-2 h-4 w-4" /> Export report
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outcome mastery</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">76%</p>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Improving</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">5</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Outcomes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs focus</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">2</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Outcomes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {outcomes.map((item) => (
          <Card key={item.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.outcome}</p>
                <p className="text-xs text-muted-foreground">Mastery {item.mastery}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className="bg-primary/10 text-primary" variant="secondary">{item.trend}</Badge>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default InstructorOutcomeAnalytics;
