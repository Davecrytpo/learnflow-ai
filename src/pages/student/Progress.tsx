import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

const tracks = [
  { id: "P-1", title: "Product Strategy", progress: 68, status: "On track" },
  { id: "P-2", title: "Growth Analytics", progress: 52, status: "At risk" },
  { id: "P-3", title: "UX Research", progress: 81, status: "Ahead" },
];

const badgeFor = (status: string) => {
  if (status === "On track") return "bg-emerald-500/10 text-emerald-600";
  if (status === "Ahead") return "bg-primary/10 text-primary";
  return "bg-amber-500/10 text-amber-600";
};

const StudentProgress = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Progress</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Learning momentum</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Monitor mastery, assignment completion, and progress by track.
            </p>
          </div>
          <TrendingUp className="h-10 w-10 text-primary" />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average completion</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">67%</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">67%</p>
            <p className="text-xs text-muted-foreground">Across tracks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lessons done</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">48</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">48</p>
            <p className="text-xs text-muted-foreground">Out of 72</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Study streak</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">11 days</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">11 days</p>
            <p className="text-xs text-muted-foreground">Keep it going</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Track progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-0 pb-0">
          {tracks.map((track) => (
            <div key={track.id} className="rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{track.title}</p>
                <Badge className={badgeFor(track.status)} variant="secondary">{track.status}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Progress value={track.progress} className="h-2" />
                <span className="text-xs text-muted-foreground">{track.progress}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default StudentProgress;
