import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollText } from "lucide-react";

const evidence = [
  { id: "AE-11", standard: "AACSB 7.2", artifact: "Capstone Rubric", status: "Submitted" },
  { id: "AE-09", standard: "ABET 3.1", artifact: "Outcome Analytics", status: "Pending" },
];

const badgeFor = (status: string) => {
  if (status === "Submitted") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const InstructorAccreditationEvidence = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Accreditation Evidence</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Evidence mapping</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Map course artifacts to accreditation standards.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <ScrollText className="mr-2 h-4 w-4" /> Upload artifact
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mapped items</CardTitle>
            <ScrollText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">32</p>
            <p className="text-xs text-muted-foreground">This program</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending review</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">5</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">27</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">27</p>
            <p className="text-xs text-muted-foreground">Accepted</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {evidence.map((item) => (
          <Card key={item.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.artifact}</p>
                <p className="text-xs text-muted-foreground">{item.standard}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(item.status)} variant="secondary">{item.status}</Badge>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default InstructorAccreditationEvidence;
