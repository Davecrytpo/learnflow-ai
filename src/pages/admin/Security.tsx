import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Lock, FileText } from "lucide-react";

const AdminSecurity = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="absolute inset-0 bg-aurora opacity-60" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Security</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Security and compliance</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enterprise controls for privacy, access, and audit readiness.</p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: ShieldCheck, title: "RLS Enforcement", body: "Row-level security applied across all LMS data." },
          { icon: Lock, title: "Role Governance", body: "Strict role boundaries for admin, instructor, and student." },
          { icon: FileText, title: "Audit Readiness", body: "Audit logs enabled for sensitive operations." },
        ].map((c) => (
          <Card key={c.title}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><c.icon className="h-4 w-4 text-primary" /> {c.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{c.body}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default AdminSecurity;
