import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Palette, UploadCloud } from "lucide-react";

const themes = [
  { id: "BR-01", name: "Default Civic Brass", status: "Active" },
  { id: "BR-02", name: "Executive Night", status: "Draft" },
];

const badgeFor = (status: string) => {
  if (status === "Active") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminBranding = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Branding</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Customize your LMS</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload logos, set brand colors, and apply custom themes.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <UploadCloud className="mr-2 h-4 w-4" /> Upload assets
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Themes</CardTitle>
            <Palette className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Configured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Custom domains</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">2</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assets</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">12</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Logos and icons</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {themes.map((theme) => (
          <Card key={theme.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{theme.name}</p>
                <p className="text-xs text-muted-foreground">Theme preset</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge className={badgeFor(theme.status)} variant="secondary">{theme.status}</Badge>
                <Button size="sm" variant="outline">Apply</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default AdminBranding;
