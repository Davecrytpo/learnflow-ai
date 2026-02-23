import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp } from "lucide-react";

const ScormImport = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="absolute inset-0 bg-aurora opacity-60" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">SCORM</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground">SCORM package import</h1>
          <p className="mt-2 text-sm text-muted-foreground">Upload a SCORM package to attach to a course module.</p>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload package</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept=".zip" />
          <Button className="gap-2"><FileUp className="h-4 w-4" /> Upload package</Button>
          <p className="text-xs text-muted-foreground">SCORM processing is queued for backend implementation.</p>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default ScormImport;
