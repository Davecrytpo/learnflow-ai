import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

const internships = [
  { id: "IN-301", title: "Product Analyst Intern", company: "Northwind", status: "Applied" },
  { id: "IN-294", title: "Growth Intern", company: "Waveform", status: "Interviewing" },
];

const badgeFor = (status: string) => {
  if (status === "Interviewing") return "bg-emerald-500/10 text-emerald-600";
  return "bg-primary/10 text-primary";
};

const StudentInternships = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Internships</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Applied opportunities</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Track applications, interview stages, and offers.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Building2 className="mr-2 h-4 w-4" /> Browse internships
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Interviews</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">2</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Offers</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">0</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">Awaiting</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {internships.map((item) => (
          <Card key={item.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.company}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(item.status)} variant="secondary">{item.status}</Badge>
                <Button size="sm" variant="outline">Update</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default StudentInternships;
