import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";

const CourseCategories = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="absolute inset-0 bg-aurora opacity-60" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Categories</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Course categories</h1>
          <p className="mt-2 text-sm text-muted-foreground">Organize the catalog with structured categories.</p>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Category name" />
          <Button className="gap-2"><Tag className="h-4 w-4" /> Add category</Button>
          <p className="text-xs text-muted-foreground">Backend wiring for persistent categories is pending.</p>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default CourseCategories;
