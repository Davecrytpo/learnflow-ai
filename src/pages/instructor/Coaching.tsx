import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserRoundCheck } from "lucide-react";

const sessions = [
  { id: "CO-11", learner: "Nia Carter", focus: "Capstone scope", time: "Mar 01, 2:00 PM" },
  { id: "CO-09", learner: "Samir Patel", focus: "Interview prep", time: "Mar 02, 11:00 AM" },
];

const InstructorCoaching = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Coaching</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Personal coaching sessions</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Schedule 1:1 guidance and track learner growth plans.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <UserRoundCheck className="mr-2 h-4 w-4" /> Schedule session
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming sessions</CardTitle>
            <UserRoundCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">32</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">32</p>
            <p className="text-xs text-muted-foreground">This term</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Feedback rating</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">4.8</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4.8</p>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sessions.map((session) => (
          <Card key={session.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{session.learner}</p>
                <p className="text-xs text-muted-foreground">{session.focus}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{session.time}</span>
                <Button size="sm" variant="outline">Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default InstructorCoaching;
