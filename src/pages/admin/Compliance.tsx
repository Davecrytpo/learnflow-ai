import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gavel, ShieldCheck, Plus, Loader2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const initialControls = [
  { id: "CMP-01", name: "FERPA Data Access", status: "Compliant", owner: "Security" },
  { id: "CMP-02", name: "SOC2 Logging", status: "Compliant", owner: "Platform" },
  { id: "CMP-03", name: "GDPR Retention", status: "Action needed", owner: "Legal" },
];

const badgeFor = (status: string) => {
  if (status === "Compliant") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminCompliance = () => {
  const { toast } = useToast();
  const [controls] = useState(initialControls);
  const [isAuditing, setIsAuditing] = useState(false);
  const [open, setOpen] = useState(false);

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuditing(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsAuditing(false);
    setOpen(false);
    toast({ title: "Audit initialized", description: "Internal compliance scanners are now processing institutional logs." });
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Compliance</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Policy adherence</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Track regulatory controls, audits, and policy acknowledgements.
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-brand text-primary-foreground">
                  <ShieldCheck className="mr-2 h-4 w-4" /> Start audit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Initialize Compliance Audit</DialogTitle></DialogHeader>
                <form onSubmit={handleStartAudit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Audit Type</Label>
                    <Input id="type" placeholder="e.g. Annual FERPA Review" required />
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>This will freeze policy modifications for the duration of the audit.</span>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isAuditing}>
                      {isAuditing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Start Scanner
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Controls</CardTitle>
              <Gavel className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">42</p>
              <p className="text-xs text-muted-foreground">Mapped controls</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Action needed</CardTitle>
              <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">3</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Open items</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last audit</CardTitle>
              <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">Passed</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Nov 2025</p>
              <p className="text-xs text-muted-foreground">SOC2 Type II</p>
            </CardContent>
          </Card>
        </div>

        <Card className="p-4">
          <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Control checklist</CardTitle>
            <Button size="sm" variant="ghost" className="text-primary text-xs gap-1"><Plus className="h-3 w-3" /> Add Control</Button>
          </CardHeader>
          <CardContent className="space-y-3 px-0 pb-0">
            {controls.map((control) => (
              <div key={control.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3 hover:bg-accent/5 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-foreground">{control.name}</p>
                  <p className="text-xs text-muted-foreground">Owner: {control.owner}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <Badge className={badgeFor(control.status)} variant="secondary">{control.status}</Badge>
                  <Button size="sm" variant="outline" onClick={() => toast({ title: "Control Review", description: `Viewing evidence for ${control.name}` })}>Review</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminCompliance;
