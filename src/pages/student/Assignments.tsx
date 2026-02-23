import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, FileCheck2, UploadCloud } from "lucide-react";

const upcoming = [
  { id: "A-401", title: "Product Vision Brief", course: "Product Strategy", due: "Mar 04, 2026", status: "Open" },
  { id: "A-402", title: "Growth Model Worksheet", course: "Growth Analytics", due: "Mar 08, 2026", status: "Open" },
  { id: "A-403", title: "Competitive Matrix", course: "Market Research", due: "Mar 10, 2026", status: "Draft" },
];

const submitted = [
  { id: "A-372", title: "Sprint Retrospective", course: "Agile Foundations", score: "94%", status: "Graded" },
  { id: "A-365", title: "Personas Workbook", course: "UX Research", score: "Pending", status: "Submitted" },
];

const overdue = [
  { id: "A-351", title: "Experiment Tracker", course: "Growth Analytics", due: "Feb 19, 2026", status: "Overdue" },
];

const badgeFor = (status: string) => {
  if (status === "Open") return "bg-emerald-500/10 text-emerald-600";
  if (status === "Draft") return "bg-amber-500/10 text-amber-600";
  if (status === "Graded") return "bg-primary/10 text-primary";
  if (status === "Submitted") return "bg-slate-500/10 text-slate-600";
  return "bg-destructive/10 text-destructive";
};

const StudentAssignments = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Assignments</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Manage your coursework</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Track due dates, submit work, and monitor grading feedback.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <UploadCloud className="mr-2 h-4 w-4" /> Submit work
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open assignments</CardTitle>
            <FileCheck2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{upcoming.length}</p>
            <p className="text-xs text-muted-foreground">Due in the next 14 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Submitted</CardTitle>
            <Badge className="bg-slate-500/10 text-slate-600" variant="secondary">2</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <Badge className="bg-destructive/10 text-destructive" variant="secondary">1</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="bg-muted/40">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3">
          {upcoming.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.course}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={badgeFor(item.status)} variant="secondary">{item.status}</Badge>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" /> {item.due}
                  </div>
                  <Button size="sm" variant="outline">Open</Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-3">
          {submitted.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.course}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={badgeFor(item.status)} variant="secondary">{item.status}</Badge>
                  <span className="text-xs font-semibold text-foreground">{item.score}</span>
                  <Button size="sm" variant="ghost">View feedback</Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-3">
          {overdue.map((item) => (
            <Card key={item.id} className="p-4 border-destructive/30">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.course}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={badgeFor(item.status)} variant="secondary">{item.status}</Badge>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" /> {item.due}
                  </div>
                  <Button size="sm">Submit now</Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  </DashboardLayout>
);

export default StudentAssignments;
