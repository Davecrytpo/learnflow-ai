import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, ShieldCheck, Plus, FileText, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const accreditations = [
  { id: "AC-12", agency: "AACSB", status: "Active", renewal: "Jun 2026" },
  { id: "AC-10", agency: "ABET", status: "Active", renewal: "Oct 2026" },
  { id: "AC-08", agency: "NEASC", status: "In review", renewal: "Dec 2026" },
];

const badgeFor = (status: string) => {
  if (status === "Active") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminAccreditation = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setIsUploading(false);
    setOpen(false);
    toast({ title: "Evidence uploaded", description: "The standard has been updated with your new artifact." });
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Accreditation</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Institutional quality</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Track accreditation cycles, evidence, and audit readiness.
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-brand text-primary-foreground">
                  <ShieldCheck className="mr-2 h-4 w-4" /> Upload evidence
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Submit Quality Evidence</DialogTitle></DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="standard">Agency / Standard</Label>
                    <Input id="standard" placeholder="e.g. AACSB Standard 4" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">File Artifact</Label>
                    <Input id="file" type="file" required />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isUploading}>
                      {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Upload Artifact
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active accreditations</CardTitle>
              <GraduationCap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">Across regions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Renewals</CardTitle>
              <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">2</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">Next 6 months</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Evidence items</CardTitle>
              <Badge className="bg-primary/10 text-primary" variant="secondary">124</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">124</p>
              <p className="text-xs text-muted-foreground">Mapped to standards</p>
            </CardContent>
          </Card>
        </div>

        <Card className="p-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg">Accreditation status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-0 pb-0">
            {accreditations.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.agency}</p>
                  <p className="text-xs text-muted-foreground">Renewal {item.renewal}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <Badge className={badgeFor(item.status)} variant="secondary">{item.status}</Badge>
                  <Button size="sm" variant="outline">Open</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminAccreditation;

