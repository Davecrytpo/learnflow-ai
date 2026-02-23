import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";

const campuses = [
  { id: "MC-01", name: "Northwind SF", status: "Active", cohorts: 6 },
  { id: "MC-02", name: "Northwind NYC", status: "Active", cohorts: 4 },
  { id: "MC-03", name: "Northwind London", status: "Pilot", cohorts: 2 },
];

const badgeFor = (status: string) => {
  if (status === "Active") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminMultiCampus = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Multi-Campus</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Campus routing</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage campuses, localized catalogs, and routing rules.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Map className="mr-2 h-4 w-4" /> Add campus
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Campuses</CardTitle>
            <Map className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Localized catalogs</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">3</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Regions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Routing rules</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">12</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Active rules</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {campuses.map((campus) => (
          <Card key={campus.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{campus.name}</p>
                <p className="text-xs text-muted-foreground">{campus.cohorts} cohorts</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(campus.status)} variant="secondary">{campus.status}</Badge>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default AdminMultiCampus;
