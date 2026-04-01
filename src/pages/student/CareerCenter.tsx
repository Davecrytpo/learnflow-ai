import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const resources = [
  { id: "CC-01", title: "Resume Review Checklist", type: "Guide" },
  { id: "CC-02", title: "Portfolio Template", type: "Template" },
  { id: "CC-03", title: "Interview Prep Kit", type: "Toolkit" },
];

const StudentCareerCenter = () => {
  const [requested, setRequested] = useState(false);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const handleRequest = () => {
    setRequested(true);
    toast.success("Resume review request submitted");
  };

  const toggleSave = (id: string) => {
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.message(saved[id] ? "Removed from saved" : "Saved to your toolkit");
  };

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Career Center</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Career acceleration</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Access resume tools, interview prep, and coaching resources.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground" onClick={handleRequest} disabled={requested}>
            <FileText className="mr-2 h-4 w-4" /> Request resume review
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Career actions</CardTitle>
            <BriefcaseBusiness className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">6</p>
            <p className="text-xs text-muted-foreground">Open tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Interviews booked</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">2</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Next 14 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">9</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">9</p>
            <p className="text-xs text-muted-foreground">Tracked</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {resources.map((item) => (
          <Card key={item.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.type}</p>
              </div>
              <Button size="sm" variant={saved[item.id] ? "default" : "outline"} onClick={() => toggleSave(item.id)}>
                {saved[item.id] ? "Saved" : "Open"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentCareerCenter;
tCareerCenter;
