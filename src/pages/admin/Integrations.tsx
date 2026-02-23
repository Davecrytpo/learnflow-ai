import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plug, ShieldCheck, Webhook } from "lucide-react";

const integrations = [
  { id: "I-301", name: "SSO (SAML 2.0)", status: "Connected", owner: "Enterprise" },
  { id: "I-298", name: "LTI 1.3 Provider", status: "Connected", owner: "Campus" },
  { id: "I-290", name: "HRIS Sync", status: "Pending", owner: "People Ops" },
];

const badgeFor = (status: string) => {
  if (status === "Connected") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminIntegrations = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Integrations</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Connect your ecosystem</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage SSO, LTI, webhooks, and data exports for your LMS stack.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Plug className="mr-2 h-4 w-4" /> Add integration
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active connections</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">9</p>
            <p className="text-xs text-muted-foreground">Across tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">2</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Awaiting credentials</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Webhooks</CardTitle>
            <Webhook className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">6</p>
            <p className="text-xs text-muted-foreground">Event streams</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Integration catalog</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Search integrations" className="max-w-xs" />
            <Button variant="outline">Filter</Button>
            <Button variant="ghost">Audit keys</Button>
          </div>
          <div className="space-y-3">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{integration.name}</p>
                  <p className="text-xs text-muted-foreground">Owner: {integration.owner}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <Badge className={badgeFor(integration.status)} variant="secondary">{integration.status}</Badge>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminIntegrations;
