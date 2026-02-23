import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScanEye, ShieldCheck } from "lucide-react";

const vendors = [
  { id: "PV-01", name: "SecureExam Pro", status: "Active", coverage: "All regions" },
  { id: "PV-02", name: "LiveWatch", status: "Active", coverage: "EU/UK" },
  { id: "PV-03", name: "Automate Guard", status: "Pilot", coverage: "NA" },
];

const badgeFor = (status: string) => {
  if (status === "Active") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminProctoring = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Proctoring</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Vendor and policy control</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage proctoring providers, data retention, and regional policies.
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Active providers</CardTitle>
            <ScanEye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Global coverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Policies</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">6</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">6</p>
            <p className="text-xs text-muted-foreground">Retention rules</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Incident rate</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">0.8%</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0.8%</p>
            <p className="text-xs text-muted-foreground">Last 90 days</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Provider directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{vendor.name}</p>
                <p className="text-xs text-muted-foreground">{vendor.coverage}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Badge className={badgeFor(vendor.status)} variant="secondary">{vendor.status}</Badge>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminProctoring;
