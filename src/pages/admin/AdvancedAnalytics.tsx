import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Radar } from "lucide-react";

const panels = [
  { id: "AA-01", name: "Retention Cohorts", status: "Live", refresh: "5 min" },
  { id: "AA-02", name: "Revenue Attribution", status: "Live", refresh: "10 min" },
  { id: "AA-03", name: "Outcome Distribution", status: "Draft", refresh: "Daily" },
];

const badgeFor = (status: string) => {
  if (status === "Live") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminAdvancedAnalytics = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Advanced Analytics</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Deep insight dashboards</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Slice engagement, retention, and outcomes by cohort or campus.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Radar className="mr-2 h-4 w-4" /> Create dashboard
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dashboards</CardTitle>
            <Radar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">14</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Signals</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">42</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">42</p>
            <p className="text-xs text-muted-foreground">Tracked KPIs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alerts</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">3</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Attention needed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {panels.map((panel) => (
          <Card key={panel.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{panel.name}</p>
                <p className="text-xs text-muted-foreground">Refresh {panel.refresh}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(panel.status)} variant="secondary">{panel.status}</Badge>
                <Button size="sm" variant="outline">Open</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default AdminAdvancedAnalytics;
