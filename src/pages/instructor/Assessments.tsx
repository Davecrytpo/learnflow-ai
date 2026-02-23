import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ClipboardSignature, PlusCircle } from "lucide-react";

const assessments = [
  { id: "AS-91", title: "Capstone Evaluation", type: "Performance", attempts: 64, status: "Live" },
  { id: "AS-88", title: "Unit 3 Knowledge Check", type: "Quiz", attempts: 112, status: "Live" },
  { id: "AS-84", title: "Portfolio Review", type: "Project", attempts: 0, status: "Draft" },
];

const badgeFor = (status: string) => {
  if (status === "Live") return "bg-emerald-500/10 text-emerald-600";
  return "bg-slate-500/10 text-slate-600";
};

const InstructorAssessments = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Assessments</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Multi-format evaluation</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Blend quizzes, projects, and performance assessments into one hub.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> New assessment
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Live assessments</CardTitle>
            <ClipboardSignature className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">11</p>
            <p className="text-xs text-muted-foreground">Across cohorts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg score</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">86%</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">86%</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            <Badge className="bg-slate-500/10 text-slate-600" variant="secondary">5</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Assessment library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Search assessments" className="max-w-xs" />
            <Button variant="outline">Filter</Button>
            <Button variant="ghost">Export</Button>
          </div>
          <div className="space-y-3">
            {assessments.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.type}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{item.attempts} attempts</span>
                  <Badge className={badgeFor(item.status)} variant="secondary">{item.status}</Badge>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default InstructorAssessments;
