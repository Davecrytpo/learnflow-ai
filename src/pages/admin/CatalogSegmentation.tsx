import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";

const segments = [
  { id: "CS-01", name: "Enterprise Programs", rules: "SSO users only", status: "Active" },
  { id: "CS-02", name: "Public Catalog", rules: "Open enrollment", status: "Active" },
  { id: "CS-03", name: "Campus Only", rules: "NYC Campus", status: "Draft" },
];

const badgeFor = (status: string) => {
  if (status === "Active") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminCatalogSegmentation = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Catalog Segmentation</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Audience-targeted catalogs</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Segment offerings by campus, tenant, or program access.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <LayoutGrid className="mr-2 h-4 w-4" /> New segment
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Segments</CardTitle>
            <LayoutGrid className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">7</p>
            <p className="text-xs text-muted-foreground">Configured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">5</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Live</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">2</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">In review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {segments.map((segment) => (
          <Card key={segment.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{segment.name}</p>
                <p className="text-xs text-muted-foreground">{segment.rules}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(segment.status)} variant="secondary">{segment.status}</Badge>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default AdminCatalogSegmentation;
