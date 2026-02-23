import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ClipboardList, PlusCircle } from "lucide-react";

const surveys = [
  { id: "S-510", title: "Module 2 Feedback", course: "Product Strategy", responses: 38, status: "Live" },
  { id: "S-507", title: "Live Session Pulse", course: "Growth Analytics", responses: 24, status: "Live" },
  { id: "S-499", title: "Cohort Satisfaction", course: "UX Research", responses: 0, status: "Draft" },
];

const badgeFor = (status: string) => {
  if (status === "Live") return "bg-emerald-500/10 text-emerald-600";
  return "bg-slate-500/10 text-slate-600";
};

const InstructorSurveys = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Surveys</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Capture learner feedback</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Design pulse checks, NPS, and module feedback forms.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> New survey
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Live surveys</CardTitle>
            <ClipboardList className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">6</p>
            <p className="text-xs text-muted-foreground">Collecting responses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Responses</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">142</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">142</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average NPS</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">54</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">54</p>
            <p className="text-xs text-muted-foreground">Positive trend</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Survey library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Search surveys" className="max-w-xs" />
            <Button variant="outline">Filter</Button>
            <Button variant="ghost">Export</Button>
          </div>
          <div className="space-y-3">
            {surveys.map((survey) => (
              <div key={survey.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{survey.title}</p>
                  <p className="text-xs text-muted-foreground">{survey.course}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{survey.responses} responses</span>
                  <Badge className={badgeFor(survey.status)} variant="secondary">{survey.status}</Badge>
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

export default InstructorSurveys;
