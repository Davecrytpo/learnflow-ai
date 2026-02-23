import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LibraryBig, UploadCloud } from "lucide-react";

const assets = [
  { id: "CL-101", title: "Design Sprint Template", type: "Template", usage: 48, status: "Published" },
  { id: "CL-098", title: "Market Sizing Worksheet", type: "PDF", usage: 62, status: "Published" },
  { id: "CL-095", title: "Activation Case Study", type: "Video", usage: 18, status: "Draft" },
];

const badgeFor = (status: string) => {
  if (status === "Published") return "bg-emerald-500/10 text-emerald-600";
  return "bg-slate-500/10 text-slate-600";
};

const InstructorContentLibrary = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Content Library</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Reusable learning assets</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage templates, videos, and resources across courses.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <UploadCloud className="mr-2 h-4 w-4" /> Upload asset
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published assets</CardTitle>
            <LibraryBig className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">86</p>
            <p className="text-xs text-muted-foreground">Across courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            <Badge className="bg-slate-500/10 text-slate-600" variant="secondary">14</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">14</p>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Most used</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">Top 10</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Top 10</p>
            <p className="text-xs text-muted-foreground">High engagement</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Asset library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Search assets" className="max-w-xs" />
            <Button variant="outline">Filter</Button>
            <Button variant="ghost">Bulk actions</Button>
          </div>
          <div className="space-y-3">
            {assets.map((asset) => (
              <div key={asset.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{asset.title}</p>
                  <p className="text-xs text-muted-foreground">{asset.type}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{asset.usage} uses</span>
                  <Badge className={badgeFor(asset.status)} variant="secondary">{asset.status}</Badge>
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

export default InstructorContentLibrary;
