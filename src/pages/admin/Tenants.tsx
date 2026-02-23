import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, PlusCircle } from "lucide-react";

const tenants = [
  { id: "T-101", name: "Northwind University", plan: "Enterprise", status: "Active", seats: 1250 },
  { id: "T-098", name: "Cedar Ridge Academy", plan: "Pro", status: "Active", seats: 320 },
  { id: "T-091", name: "Waveform Labs", plan: "Growth", status: "Pending", seats: 80 },
];

const badgeFor = (status: string) => {
  if (status === "Active") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminTenants = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Tenants</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Multi-tenant administration</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage organizations, seat limits, and tenancy provisioning.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> New tenant
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active tenants</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">14</p>
            <p className="text-xs text-muted-foreground">Across regions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total seats</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">6,850</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">6,850</p>
            <p className="text-xs text-muted-foreground">Provisioned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">2</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Awaiting setup</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Tenant directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Search tenants" className="max-w-xs" />
            <Button variant="outline">Filter</Button>
            <Button variant="ghost">Export</Button>
          </div>
          <div className="space-y-3">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{tenant.name}</p>
                  <p className="text-xs text-muted-foreground">{tenant.plan} plan · {tenant.seats} seats</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <Badge className={badgeFor(tenant.status)} variant="secondary">{tenant.status}</Badge>
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

export default AdminTenants;
