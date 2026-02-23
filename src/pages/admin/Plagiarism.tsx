import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileSearch, ShieldCheck } from "lucide-react";

const scans = [
  { id: "PL-552", course: "Product Strategy", submissions: 86, flagged: 3, status: "Completed" },
  { id: "PL-547", course: "Growth Analytics", submissions: 74, flagged: 1, status: "Completed" },
  { id: "PL-540", course: "UX Research", submissions: 55, flagged: 4, status: "In progress" },
];

const badgeFor = (status: string) => {
  if (status === "Completed") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminPlagiarism = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Plagiarism</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Similarity detection</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage plagiarism scans, vendor configuration, and thresholds.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <ShieldCheck className="mr-2 h-4 w-4" /> Run scan
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scans this month</CardTitle>
            <FileSearch className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">18</p>
            <p className="text-xs text-muted-foreground">Across courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flag rate</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">2.1%</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2.1%</p>
            <p className="text-xs text-muted-foreground">Down from 3.4%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendors</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">2</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Active integrations</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Scan activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {scans.map((scan) => (
            <div key={scan.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{scan.course}</p>
                <p className="text-xs text-muted-foreground">{scan.submissions} submissions</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{scan.flagged} flagged</span>
                <Badge className={badgeFor(scan.status)} variant="secondary">{scan.status}</Badge>
                <Button size="sm" variant="outline">Open</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminPlagiarism;
