import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UsersRound } from "lucide-react";

const alumni = [
  { id: "AL-11", name: "Jordan Lee", role: "PM at Northwind", status: "Mentor" },
  { id: "AL-09", name: "Fatima Noor", role: "Growth at Waveform", status: "Speaker" },
  { id: "AL-05", name: "Ravi Kumar", role: "UX Lead at Cedar Ridge", status: "Available" },
];

const badgeFor = (status: string) => {
  if (status === "Mentor") return "bg-emerald-500/10 text-emerald-600";
  if (status === "Speaker") return "bg-primary/10 text-primary";
  return "bg-slate-500/10 text-slate-600";
};

const StudentAlumniNetwork = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Alumni Network</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Learn from alumni</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect with graduates, mentors, and industry experts.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <UsersRound className="mr-2 h-4 w-4" /> Join event
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alumni mentors</CardTitle>
            <UsersRound className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">24</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Events</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">4</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Community posts</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">86</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">86</p>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {alumni.map((member) => (
          <Card key={member.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(member.status)} variant="secondary">{member.status}</Badge>
                <Button size="sm" variant="outline">Connect</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default StudentAlumniNetwork;
