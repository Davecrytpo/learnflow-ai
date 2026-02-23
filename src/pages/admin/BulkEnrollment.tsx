import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

const BulkEnrollment = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="absolute inset-0 bg-aurora opacity-60" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Bulk Enrollment</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Upload enrollment CSV</h1>
          <p className="mt-2 text-sm text-muted-foreground">Import students and enroll them in courses at scale.</p>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload file</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept=".csv" />
          <Button className="gap-2"><Upload className="h-4 w-4" /> Upload CSV</Button>
          <p className="text-xs text-muted-foreground">CSV parser and background jobs are pending backend wiring.</p>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default BulkEnrollment;
