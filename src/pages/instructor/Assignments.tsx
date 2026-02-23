import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, FileCheck2, PlusCircle } from "lucide-react";

const assignments = [
  { id: "A-771", title: "Capstone Proposal", course: "Product Strategy", due: "Mar 05, 2026", submissions: 18, status: "Open" },
  { id: "A-769", title: "Activation Funnel Audit", course: "Growth Analytics", due: "Mar 12, 2026", submissions: 9, status: "Scheduled" },
  { id: "A-760", title: "Discovery Interview Debrief", course: "UX Research", due: "Feb 22, 2026", submissions: 26, status: "Grading" },
];

const badgeFor = (status: string) => {
  if (status === "Open") return "bg-emerald-500/10 text-emerald-600";
  if (status === "Scheduled") return "bg-amber-500/10 text-amber-600";
  return "bg-primary/10 text-primary";
};

const InstructorAssignments = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Assignments</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Create and assess coursework</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Organize assignment workflows, rubrics, and submission tracking.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> New assignment
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            <FileCheck2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">7</p>
            <p className="text-xs text-muted-foreground">Open for submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs grading</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">12</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Awaiting feedback</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
            <Badge className="bg-slate-500/10 text-slate-600" variant="secondary">24</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">24</p>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Assignment tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Search assignments" className="max-w-xs" />
            <Button variant="outline">Filter</Button>
            <Button variant="ghost">Export</Button>
          </div>
          <div className="space-y-3">
            {assignments.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.course}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {item.due}</span>
                  <span>{item.submissions} submissions</span>
                  <Badge className={badgeFor(item.status)} variant="secondary">{item.status}</Badge>
                  <Button size="sm" variant="outline">Open</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default InstructorAssignments;
