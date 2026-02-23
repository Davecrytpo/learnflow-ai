import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

const competencies = [
  { id: "C-01", title: "Problem Framing", score: 82, status: "Mastered" },
  { id: "C-02", title: "Market Sizing", score: 61, status: "Developing" },
  { id: "C-03", title: "Experiment Design", score: 74, status: "Proficient" },
];

const badgeFor = (status: string) => {
  if (status === "Mastered") return "bg-emerald-500/10 text-emerald-600";
  if (status === "Proficient") return "bg-primary/10 text-primary";
  return "bg-amber-500/10 text-amber-600";
};

const StudentCompetencies = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Competencies</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Skills mastered</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Track mastery levels aligned to your program outcomes.
            </p>
          </div>
          <Trophy className="h-10 w-10 text-primary" />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mastered</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">4</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground">Above 80%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Proficient</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">6</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">6</p>
            <p className="text-xs text-muted-foreground">65-80%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Developing</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">3</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Needs focus</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Competency map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-0 pb-0">
          {competencies.map((item) => (
            <div key={item.id} className="rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <Badge className={badgeFor(item.status)} variant="secondary">{item.status}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Progress value={item.score} className="h-2" />
                <span className="text-xs text-muted-foreground">{item.score}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default StudentCompetencies;
