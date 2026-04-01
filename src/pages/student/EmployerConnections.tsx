import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";

const partners = [
  { id: "EM-01", name: "Northwind", status: "Open roles", hiring: 4 },
  { id: "EM-02", name: "Waveform Labs", status: "Campus event", hiring: 2 },
  { id: "EM-03", name: "Cedar Ridge", status: "Hiring soon", hiring: 1 },
];

const badgeFor = (status: string) => {
  if (status === "Open roles") return "bg-emerald-500/10 text-emerald-600";
  if (status === "Campus event") return "bg-primary/10 text-primary";
  return "bg-amber-500/10 text-amber-600";
};

const StudentEmployerConnections = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Employer Connections</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Connect with hiring partners</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore employers, events, and hiring pipelines.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Building className="mr-2 h-4 w-4" /> Request intro
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Partners</CardTitle>
            <Building className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">18</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Events</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">3</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Warm intros</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">5</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {partners.map((partner) => (
          <Card key={partner.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{partner.name}</p>
                <p className="text-xs text-muted-foreground">{partner.hiring} open roles</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(partner.status)} variant="secondary">{partner.status}</Badge>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default StudentEmployerConnections;
rConnections;
