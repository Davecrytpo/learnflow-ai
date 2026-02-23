import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, Download } from "lucide-react";

const exportsList = [
  { id: "EX-520", name: "User Activity Log", schedule: "Daily", status: "Running" },
  { id: "EX-514", name: "Course Completion", schedule: "Weekly", status: "Running" },
  { id: "EX-503", name: "Assessment Outcomes", schedule: "Monthly", status: "Paused" },
];

const badgeFor = (status: string) => {
  if (status === "Running") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminDataExports = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Data Exports</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Reporting pipelines</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Schedule exports, manage destinations, and ensure data governance.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Download className="mr-2 h-4 w-4" /> New export
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active exports</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Running schedules</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Destinations</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">5</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Warehouses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last sync</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">2h ago</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2h ago</p>
            <p className="text-xs text-muted-foreground">All systems green</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Export schedules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {exportsList.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">Schedule: {item.schedule}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Badge className={badgeFor(item.status)} variant="secondary">{item.status}</Badge>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminDataExports;
