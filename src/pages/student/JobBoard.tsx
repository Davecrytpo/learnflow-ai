import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const jobs = [
  { id: "JB-901", title: "Associate Product Manager", company: "Northwind", location: "Remote", status: "New" },
  { id: "JB-895", title: "Growth Analyst", company: "Waveform", location: "San Francisco", status: "Hot" },
  { id: "JB-888", title: "UX Researcher", company: "Cedar Ridge", location: "New York", status: "New" },
];

const badgeFor = (status: string) => {
  if (status === "Hot") return "bg-destructive/10 text-destructive";
  return "bg-emerald-500/10 text-emerald-600";
};

const StudentJobBoard = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Job Board</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Curated roles</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore roles aligned with your skills and portfolio.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Search className="mr-2 h-4 w-4" /> Search roles
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open roles</CardTitle>
            <Search className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">124</p>
            <p className="text-xs text-muted-foreground">Updated daily</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saved</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">6</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">6</p>
            <p className="text-xs text-muted-foreground">For later</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applied</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">3</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {jobs.map((job) => (
          <Card key={job.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{job.title}</p>
                <p className="text-xs text-muted-foreground">{job.company} · {job.location}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(job.status)} variant="secondary">{job.status}</Badge>
                <Button size="sm" variant="outline">Apply</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default StudentJobBoard;
dentJobBoard;
