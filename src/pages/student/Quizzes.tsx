import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, HelpCircle, Target } from "lucide-react";

const upcoming = [
  { id: "Q-110", title: "Market Segmentation Quiz", course: "Market Research", due: "Mar 06, 2026", duration: "25 min", attempts: 2 },
  { id: "Q-111", title: "Sprint Planning Check", course: "Agile Foundations", due: "Mar 09, 2026", duration: "15 min", attempts: 1 },
];

const completed = [
  { id: "Q-097", title: "UX Principles", course: "UX Research", score: "88%", status: "Passed" },
  { id: "Q-094", title: "Activation Metrics", course: "Growth Analytics", score: "71%", status: "Retake" },
];

const draft = [
  { id: "Q-089", title: "North Star Metric", course: "Product Strategy", status: "Saved draft" },
];

const badgeFor = (status: string) => {
  if (status === "Passed") return "bg-emerald-500/10 text-emerald-600";
  if (status === "Retake") return "bg-amber-500/10 text-amber-600";
  return "bg-slate-500/10 text-slate-600";
};

const StudentQuizzes = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Quizzes</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Stay assessment-ready</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Take quizzes, review attempts, and get instant feedback on mastery.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <HelpCircle className="mr-2 h-4 w-4" /> Start practice quiz
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{upcoming.length}</p>
            <p className="text-xs text-muted-foreground">Due this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <Target className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completed.length}</p>
            <p className="text-xs text-muted-foreground">View results</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            <Badge className="bg-slate-500/10 text-slate-600" variant="secondary">1</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Resume anytime</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="bg-muted/40">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3">
          {upcoming.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.course}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Due {item.due}</span>
                  <span>{item.duration}</span>
                  <span>{item.attempts} attempts</span>
                  <Button size="sm">Start</Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completed.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.course}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={badgeFor(item.status)} variant="secondary">{item.status}</Badge>
                  <span className="text-xs font-semibold text-foreground">{item.score}</span>
                  <Button size="sm" variant="ghost">Review</Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="draft" className="space-y-3">
          {draft.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.course}</p>
                </div>
                <Button size="sm" variant="outline">Resume</Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  </DashboardLayout>
);

export default StudentQuizzes;
