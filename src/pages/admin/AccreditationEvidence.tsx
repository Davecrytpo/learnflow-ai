import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollText } from "lucide-react";

const evidence = [
  { id: "AE-21", standard: "AACSB 7.2", artifacts: 12, status: "On track" },
  { id: "AE-19", standard: "ABET 3.1", artifacts: 8, status: "Needs review" },
  { id: "AE-16", standard: "NEASC 4.4", artifacts: 6, status: "On track" },
];

const badgeFor = (status: string) => {
  if (status === "On track") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminAccreditationEvidence = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Accreditation Evidence</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Institutional evidence hub</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Monitor evidence coverage and gaps across standards.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <ScrollText className="mr-2 h-4 w-4" /> Export bundle
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Standards</CardTitle>
            <ScrollText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">9</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Artifacts</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">186</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">186</p>
            <p className="text-xs text-muted-foreground">Mapped</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gaps</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">3</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Need evidence</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {evidence.map((item) => (
          <Card key={item.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.standard}</p>
                <p className="text-xs text-muted-foreground">{item.artifacts} artifacts</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(item.status)} variant="secondary">{item.status}</Badge>
                <Button size="sm" variant="outline">Review</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default AdminAccreditationEvidence;
