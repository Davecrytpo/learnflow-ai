import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gavel, ShieldCheck } from "lucide-react";

const controls = [
  { id: "CMP-01", name: "FERPA Data Access", status: "Compliant", owner: "Security" },
  { id: "CMP-02", name: "SOC2 Logging", status: "Compliant", owner: "Platform" },
  { id: "CMP-03", name: "GDPR Retention", status: "Action needed", owner: "Legal" },
];

const badgeFor = (status: string) => {
  if (status === "Compliant") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminCompliance = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Compliance</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Policy adherence</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Track regulatory controls, audits, and policy acknowledgements.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <ShieldCheck className="mr-2 h-4 w-4" /> Start audit
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Controls</CardTitle>
            <Gavel className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">42</p>
            <p className="text-xs text-muted-foreground">Mapped controls</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Action needed</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">3</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Open items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last audit</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">Passed</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Nov 2025</p>
            <p className="text-xs text-muted-foreground">SOC2 Type II</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Control checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {controls.map((control) => (
            <div key={control.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{control.name}</p>
                <p className="text-xs text-muted-foreground">Owner: {control.owner}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Badge className={badgeFor(control.status)} variant="secondary">{control.status}</Badge>
                <Button size="sm" variant="outline">Review</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminCompliance;
