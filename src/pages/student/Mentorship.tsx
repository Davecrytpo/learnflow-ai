import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeartHandshake, UserRound } from "lucide-react";

const mentors = [
  { id: "M-11", name: "Ava Summers", role: "Product Lead", status: "Matched" },
  { id: "M-08", name: "Rahul Desai", role: "Growth PM", status: "Available" },
];

const badgeFor = (status: string) => {
  if (status === "Matched") return "bg-emerald-500/10 text-emerald-600";
  return "bg-slate-500/10 text-slate-600";
};

const StudentMentorship = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Mentorship</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">1:1 mentor guidance</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Schedule sessions, set goals, and track mentor feedback.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <UserRound className="mr-2 h-4 w-4" /> Request mentor
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active mentors</CardTitle>
            <HeartHandshake className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Matched</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions booked</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">3</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Action items</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">4</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {mentors.map((mentor) => (
          <Card key={mentor.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{mentor.name}</p>
                <p className="text-xs text-muted-foreground">{mentor.role}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(mentor.status)} variant="secondary">{mentor.status}</Badge>
                <Button size="sm" variant="outline">Message</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default StudentMentorship;
