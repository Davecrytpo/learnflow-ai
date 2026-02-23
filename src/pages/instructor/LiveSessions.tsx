import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video } from "lucide-react";

const sessions = [
  { id: "LS-144", title: "Capstone Clinic", course: "Product Strategy", date: "Mar 03, 2026", time: "2:00 PM", status: "Scheduled" },
  { id: "LS-142", title: "Activation Metrics Q&A", course: "Growth Analytics", date: "Mar 05, 2026", time: "11:00 AM", status: "Scheduled" },
  { id: "LS-139", title: "Research Panel Review", course: "UX Research", date: "Feb 24, 2026", time: "4:00 PM", status: "Recorded" },
];

const badgeFor = (status: string) => {
  if (status === "Recorded") return "bg-primary/10 text-primary";
  return "bg-emerald-500/10 text-emerald-600";
};

const InstructorLiveSessions = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Live Sessions</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Synchronous learning</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Schedule live classes, manage recordings, and track attendance.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Video className="mr-2 h-4 w-4" /> Schedule session
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming sessions</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Next 14 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recorded</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">12</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Available to learners</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attendance rate</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">87%</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">87%</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Session schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {sessions.map((session) => (
            <div key={session.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{session.title}</p>
                <p className="text-xs text-muted-foreground">{session.course}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(session.status)} variant="secondary">{session.status}</Badge>
                <span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {session.date} · {session.time}</span>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default InstructorLiveSessions;
