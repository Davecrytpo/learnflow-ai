import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, Play } from "lucide-react";

const pipelines = [
  { id: "DP-41", name: "Learner Event Stream", status: "Healthy", lastRun: "5 min ago" },
  { id: "DP-38", name: "Assessment Aggregation", status: "Healthy", lastRun: "23 min ago" },
  { id: "DP-34", name: "Revenue Attribution", status: "Degraded", lastRun: "2h ago" },
];

const badgeFor = (status: string) => {
  if (status === "Healthy") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminDataPipelines = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Data Pipelines</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Analytics pipeline health</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Monitor ingestion, transformation, and delivery SLAs.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Play className="mr-2 h-4 w-4" /> Trigger pipeline
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active pipelines</CardTitle>
            <Network className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">9</p>
            <p className="text-xs text-muted-foreground">All regions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">SLAs met</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">98.6%</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">98.6%</p>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alerts</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">2</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Pipeline registry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {pipelines.map((pipe) => (
            <div key={pipe.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{pipe.name}</p>
                <p className="text-xs text-muted-foreground">Last run {pipe.lastRun}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Badge className={badgeFor(pipe.status)} variant="secondary">{pipe.status}</Badge>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminDataPipelines;
