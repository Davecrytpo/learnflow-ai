import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Video } from "lucide-react";

const exams = [
  { id: "PX-101", title: "Capstone Readiness Exam", course: "Product Strategy", window: "Mar 06-08, 2026", status: "Scheduled" },
  { id: "PX-099", title: "Market Sizing Final", course: "Market Research", window: "Feb 27, 2026", status: "Ready" },
];

const badgeFor = (status: string) => {
  if (status === "Ready") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const StudentProctoredExams = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Proctored Exams</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Secure assessments</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Verify identity, check system readiness, and launch proctored tests.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Video className="mr-2 h-4 w-4" /> Run system check
          </Button>
        </div>
      </section>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Next 14 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">5</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">All verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Incidents</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">0</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">This term</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Exam schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {exams.map((exam) => (
            <div key={exam.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{exam.title}</p>
                <p className="text-xs text-muted-foreground">{exam.course}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{exam.window}</span>
                <Badge className={badgeFor(exam.status)} variant="secondary">{exam.status}</Badge>
                <Button size="sm" variant="outline">Launch</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default StudentProctoredExams;
