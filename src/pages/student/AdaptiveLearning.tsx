import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Target } from "lucide-react";

const recommendations = [
  { id: "A-1", title: "Redo lesson: Market Segmentation", reason: "Score below 70%", impact: "High" },
  { id: "A-2", title: "Practice quiz: Activation Metrics", reason: "Low confidence", impact: "Medium" },
  { id: "A-3", title: "Watch clip: Interview Synthesis", reason: "Skipped content", impact: "Low" },
];

const badgeFor = (impact: string) => {
  if (impact === "High") return "bg-destructive/10 text-destructive";
  if (impact === "Medium") return "bg-amber-500/10 text-amber-600";
  return "bg-slate-500/10 text-slate-600";
};

const StudentAdaptiveLearning = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Adaptive Learning</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Personalized next steps</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              AI-driven recommendations tailored to your performance patterns.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Sparkles className="mr-2 h-4 w-4" /> Refresh insights
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next focus area</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Market sizing</p>
            <p className="text-xs text-muted-foreground">Improve by 12%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confidence</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">62%</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">62%</p>
            <p className="text-xs text-muted-foreground">Based on last 7 assessments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Boost plan</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">3 actions</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3 actions</p>
            <p className="text-xs text-muted-foreground">Estimated 2h</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Recommended actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {recommendations.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.reason}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(item.impact)} variant="secondary">{item.impact}</Badge>
                <Button size="sm" variant="outline">Start</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default StudentAdaptiveLearning;
