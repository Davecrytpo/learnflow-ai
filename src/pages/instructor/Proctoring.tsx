import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Video } from "lucide-react";

const sessions = [
  { id: "PR-401", exam: "Capstone Readiness", date: "Mar 06, 2026", incidents: 0, status: "Scheduled" },
  { id: "PR-396", exam: "Market Sizing Final", date: "Feb 27, 2026", incidents: 1, status: "Reviewed" },
];

const badgeFor = (status: string) => {
  if (status === "Reviewed") return "bg-primary/10 text-primary";
  return "bg-emerald-500/10 text-emerald-600";
};

const InstructorProctoring = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Proctoring</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Exam integrity management</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Configure proctoring settings and review flagged sessions.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Video className="mr-2 h-4 w-4" /> Configure settings
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active exams</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flagged sessions</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">1</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Integrity score</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">96%</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">96%</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Session log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {sessions.map((session) => (
            <div key={session.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{session.exam}</p>
                <p className="text-xs text-muted-foreground">{session.date}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{session.incidents} incidents</span>
                <Badge className={badgeFor(session.status)} variant="secondary">{session.status}</Badge>
                <Button size="sm" variant="outline">Review</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default InstructorProctoring;
