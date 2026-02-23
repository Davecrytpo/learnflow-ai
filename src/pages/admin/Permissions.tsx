import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { KeyRound, ShieldCheck, UserCog } from "lucide-react";

const roles = [
  { id: "P-01", name: "Admin", users: 12, level: "Full access" },
  { id: "P-02", name: "Instructor", users: 124, level: "Course management" },
  { id: "P-03", name: "Student", users: 1840, level: "Learning access" },
];

const AdminPermissions = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Permissions</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Access control and roles</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Govern permission sets, role overrides, and approval workflows.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <UserCog className="mr-2 h-4 w-4" /> Create role
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Role sets</CardTitle>
            <KeyRound className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">9</p>
            <p className="text-xs text-muted-foreground">Custom roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approval workflows</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Active policies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Privileged users</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">46</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">46</p>
            <p className="text-xs text-muted-foreground">With overrides</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Role directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Search roles" className="max-w-xs" />
            <Button variant="outline">Filter</Button>
            <Button variant="ghost">Export</Button>
          </div>
          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{role.name}</p>
                  <p className="text-xs text-muted-foreground">{role.level}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{role.users} users</span>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminPermissions;
