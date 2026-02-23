import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Key, ShieldCheck } from "lucide-react";

const providers = [
  { id: "SSO-01", name: "Okta", status: "Connected", method: "SAML 2.0" },
  { id: "SSO-02", name: "Azure AD", status: "Connected", method: "OIDC" },
  { id: "SSO-03", name: "Google Workspace", status: "Pending", method: "OIDC" },
];

const badgeFor = (status: string) => {
  if (status === "Connected") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminSSOProvisioning = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">SSO Provisioning</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Enterprise single sign-on</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Configure identity providers, metadata, and login policies.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <ShieldCheck className="mr-2 h-4 w-4" /> Add provider
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active IdPs</CardTitle>
            <Key className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Connected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">SSO coverage</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">88%</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">88%</p>
            <p className="text-xs text-muted-foreground">Users via SSO</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Login issues</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">3</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Last 24h</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Identity providers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {providers.map((provider) => (
            <div key={provider.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{provider.name}</p>
                <p className="text-xs text-muted-foreground">{provider.method}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Badge className={badgeFor(provider.status)} variant="secondary">{provider.status}</Badge>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminSSOProvisioning;
