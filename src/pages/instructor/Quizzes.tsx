import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { HelpCircle, PlusCircle, Timer } from "lucide-react";

const quizzes = [
  { id: "Q-410", title: "Activation Metrics", course: "Growth Analytics", attempts: 48, avgScore: "82%", status: "Live" },
  { id: "Q-404", title: "Market Segmentation", course: "Market Research", attempts: 31, avgScore: "76%", status: "Scheduled" },
  { id: "Q-398", title: "Sprint Planning Check", course: "Agile Foundations", attempts: 22, avgScore: "91%", status: "Draft" },
];

const badgeFor = (status: string) => {
  if (status === "Live") return "bg-emerald-500/10 text-emerald-600";
  if (status === "Scheduled") return "bg-amber-500/10 text-amber-600";
  return "bg-slate-500/10 text-slate-600";
};

const InstructorQuizzes = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Quizzes</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Assess knowledge quickly</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Build timed quizzes, manage attempts, and track performance.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> New quiz
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Live quizzes</CardTitle>
            <HelpCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Active this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attempts</CardTitle>
            <Timer className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">219</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average score</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">84%</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">84%</p>
            <p className="text-xs text-muted-foreground">Across programs</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Quiz library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Search quizzes" className="max-w-xs" />
            <Button variant="outline">Filter</Button>
            <Button variant="ghost">Duplicate</Button>
          </div>
          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{quiz.title}</p>
                  <p className="text-xs text-muted-foreground">{quiz.course}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{quiz.attempts} attempts</span>
                  <span>Avg {quiz.avgScore}</span>
                  <Badge className={badgeFor(quiz.status)} variant="secondary">{quiz.status}</Badge>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default InstructorQuizzes;
