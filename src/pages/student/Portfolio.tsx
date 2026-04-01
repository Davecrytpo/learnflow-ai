import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, Share2 } from "lucide-react";

const artifacts = [
  { id: "P-101", title: "Capstone Pitch Deck", type: "Presentation", visibility: "Public" },
  { id: "P-097", title: "Growth Experiment Report", type: "PDF", visibility: "Private" },
  { id: "P-092", title: "UX Research Summary", type: "Document", visibility: "Public" },
];

const badgeFor = (visibility: string) => {
  if (visibility === "Public") return "bg-emerald-500/10 text-emerald-600";
  return "bg-slate-500/10 text-slate-600";
};

const StudentPortfolio = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Portfolio</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Showcase your work</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Curate artifacts, capstones, and credentials for employers.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <FileText className="mr-2 h-4 w-4" /> Add artifact
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Public items</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">7</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">7</p>
            <p className="text-xs text-muted-foreground">Shareable</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Private drafts</CardTitle>
            <Badge className="bg-slate-500/10 text-slate-600" variant="secondary">5</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profile views</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">312</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {artifacts.map((item) => (
          <Card key={item.id} className="p-4">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.type}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(item.visibility)} variant="secondary">{item.visibility}</Badge>
                <Button size="sm" variant="outline">
                  <Share2 className="mr-2 h-3 w-3" /> Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default StudentPortfolio;
entPortfolio;
