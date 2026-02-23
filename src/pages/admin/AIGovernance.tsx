import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, ShieldCheck } from "lucide-react";

const policies = [
  { id: "AI-01", name: "Adaptive Recommendations", status: "Approved", owner: "AI Council" },
  { id: "AI-02", name: "Proctoring Insights", status: "In review", owner: "Compliance" },
  { id: "AI-03", name: "Content Generation", status: "Approved", owner: "Product" },
];

const badgeFor = (status: string) => {
  if (status === "Approved") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminAIGovernance = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">AI Governance</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Responsible AI controls</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review AI policies, audit logs, and bias checks across features.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <ShieldCheck className="mr-2 h-4 w-4" /> Run audit
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Policies</CardTitle>
            <Bot className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">9</p>
            <p className="text-xs text-muted-foreground">Active policies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending review</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">2</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Waiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bias checks</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">Pass</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Pass</p>
            <p className="text-xs text-muted-foreground">Last run Feb 20</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Policy register</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {policies.map((policy) => (
            <div key={policy.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{policy.name}</p>
                <p className="text-xs text-muted-foreground">Owner: {policy.owner}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Badge className={badgeFor(policy.status)} variant="secondary">{policy.status}</Badge>
                <Button size="sm" variant="outline">Review</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminAIGovernance;
