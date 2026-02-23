import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileSignature, PlusCircle } from "lucide-react";

const rubrics = [
  { id: "R-88", title: "Capstone Evaluation", course: "Product Strategy", criteria: 6, status: "Active" },
  { id: "R-84", title: "Sprint Retrospective", course: "Agile Foundations", criteria: 4, status: "Draft" },
  { id: "R-81", title: "Interview Debrief", course: "UX Research", criteria: 5, status: "Active" },
];

const badgeFor = (status: string) => {
  if (status === "Active") return "bg-emerald-500/10 text-emerald-600";
  return "bg-slate-500/10 text-slate-600";
};

const InstructorRubrics = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Rubrics</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Consistent grading standards</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Define criteria, weights, and feedback guidance for every assignment.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> New rubric
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active rubrics</CardTitle>
            <FileSignature className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">9</p>
            <p className="text-xs text-muted-foreground">Across programs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            <Badge className="bg-slate-500/10 text-slate-600" variant="secondary">3</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Standard templates</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">5</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Reusable models</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Rubric library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Search rubrics" className="max-w-xs" />
            <Button variant="outline">Filter</Button>
            <Button variant="ghost">Duplicate</Button>
          </div>
          <div className="space-y-3">
            {rubrics.map((rubric) => (
              <div key={rubric.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{rubric.title}</p>
                  <p className="text-xs text-muted-foreground">{rubric.course}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{rubric.criteria} criteria</span>
                  <Badge className={badgeFor(rubric.status)} variant="secondary">{rubric.status}</Badge>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default InstructorRubrics;
