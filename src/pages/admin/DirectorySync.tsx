import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldCheck } from "lucide-react";

const connectors = [
  { id: "DS-01", name: "Azure AD SCIM", status: "Active", lastSync: "10 min ago" },
  { id: "DS-02", name: "Okta SCIM", status: "Active", lastSync: "25 min ago" },
  { id: "DS-03", name: "Workday HRIS", status: "Paused", lastSync: "2 days ago" },
];

const badgeFor = (status: string) => {
  if (status === "Active") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminDirectorySync = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Directory Sync</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Automated user provisioning</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Keep users, roles, and groups in sync with SCIM integrations.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <ShieldCheck className="mr-2 h-4 w-4" /> Add connector
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active syncs</CardTitle>
            <RefreshCw className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last sync</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">10 min</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">10 min</p>
            <p className="text-xs text-muted-foreground">All systems green</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sync errors</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">1</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Connector list</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {connectors.map((connector) => (
            <div key={connector.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{connector.name}</p>
                <p className="text-xs text-muted-foreground">Last sync {connector.lastSync}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Badge className={badgeFor(connector.status)} variant="secondary">{connector.status}</Badge>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminDirectorySync;
