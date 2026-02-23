import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

const milestones = [
  { id: "CS-1", title: "Problem statement approved", status: "Done", date: "Feb 14, 2026" },
  { id: "CS-2", title: "Research synthesis draft", status: "In review", date: "Feb 28, 2026" },
  { id: "CS-3", title: "Final presentation", status: "Upcoming", date: "Mar 12, 2026" },
];

const badgeFor = (status: string) => {
  if (status === "Done") return "bg-emerald-500/10 text-emerald-600";
  if (status === "In review") return "bg-amber-500/10 text-amber-600";
  return "bg-slate-500/10 text-slate-600";
};

const StudentCapstoneTracker = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Capstone Tracker</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Capstone progress</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Track milestones, feedback, and advisor approvals.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Target className="mr-2 h-4 w-4" /> Update milestone
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Milestones</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">9</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">4</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground">On track</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Advisor feedback</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">2</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {milestones.map((item) => (
          <Card key={item.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(item.status)} variant="secondary">{item.status}</Badge>
                <Button size="sm" variant="outline">Open</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default StudentCapstoneTracker;
