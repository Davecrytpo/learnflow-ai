import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Route, Sparkles } from "lucide-react";

const milestones = [
  { id: "LP-1", title: "Complete onboarding and baseline assessment", due: "Feb 26, 2026", status: "In progress" },
  { id: "LP-2", title: "Finish Product Strategy module 1", due: "Mar 05, 2026", status: "Planned" },
  { id: "LP-3", title: "Submit capstone proposal draft", due: "Mar 12, 2026", status: "Planned" },
];

const badgeFor = (status: string) => {
  if (status === "In progress") return "bg-primary/10 text-primary";
  return "bg-slate-500/10 text-slate-600";
};

const StudentLearningPlan = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Learning Plan</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Personalized path to mastery</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your roadmap across courses, milestones, and capstone deliverables.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Sparkles className="mr-2 h-4 w-4" /> Optimize plan
          </Button>
        </div>
      </section>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Milestones</CardTitle>
            <Route className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On track</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">8</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8</p>
            <p className="text-xs text-muted-foreground">Aligned with deadlines</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">At risk</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">2</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Upcoming milestones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {milestones.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">Recommended by advisor</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(item.status)} variant="secondary">{item.status}</Badge>
                <span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {item.due}</span>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default StudentLearningPlan;
