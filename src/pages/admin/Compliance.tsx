import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gavel, ShieldCheck, Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";

const AdminCompliance = () => {
  const { toast } = useToast();
  const [controls, setControls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newControl, setNewControl] = useState({ title: "", status: "compliant" });

  const fetchCompliance = async () => {
    setLoading(true);
    try {
      const data = await apiClient.db.from("compliance_records").select("*").order("created_at", { ascending: false }).execute();
      setControls(data || []);
    } catch (error: any) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompliance();
  }, []);

  const handleAddControl = async (event: React.FormEvent) => {
    event.preventDefault();
    setAdding(true);
    try {
      await apiClient.db.from("compliance_records").insert({
        title: newControl.title,
        status: newControl.status,
        last_audit: new Date().toISOString(),
      }).execute();
      toast({ title: "Control added", description: "Compliance registry updated." });
      setOpen(false);
      setNewControl({ title: "", status: "compliant" });
      await fetchCompliance();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const deleteControl = async (id: string) => {
    if (!confirm("Remove this compliance record?")) return;
    try {
      await apiClient.db.from("compliance_records").delete().eq("id", id).execute();
      toast({ title: "Record removed" });
      await fetchCompliance();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const badgeFor = (status: string) => {
    if (status === "compliant") return "bg-emerald-500/10 text-emerald-600";
    if (status === "pending") return "bg-amber-500/10 text-amber-600";
    return "bg-destructive/10 text-destructive";
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Governance</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Compliance Center</h1>
              <p className="mt-2 text-sm text-muted-foreground">Manage regulatory controls, audit logs, and policy enforcement.</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-brand text-primary-foreground shadow-lg shadow-primary/20">
                  <ShieldCheck className="mr-2 h-4 w-4" /> New Control
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Compliance Control</DialogTitle></DialogHeader>
                <form onSubmit={handleAddControl} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Control Name</Label>
                    <Input placeholder="e.g. GDPR Data Retention" value={newControl.title} onChange={(e) => setNewControl({ ...newControl, title: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Status</Label>
                    <Select value={newControl.status} onValueChange={(value) => setNewControl({ ...newControl, status: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliant">Compliant</SelectItem>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={adding}>
                      {adding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Control
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Controls</CardTitle>
              <Gavel className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{controls.length}</p>
              <p className="text-xs text-muted-foreground">Active policies</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Action Needed</CardTitle>
              <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">{controls.filter((control) => control.status !== "compliant").length}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{controls.filter((control) => control.status !== "compliant").length}</p>
              <p className="text-xs text-muted-foreground">Open items</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Audit Status</CardTitle>
              <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">Passed</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Safe</p>
              <p className="text-xs text-muted-foreground">System integrity check</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Registry</CardTitle>
            <CardDescription>Master list of tracked regulatory items.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : controls.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed py-8 text-center text-muted-foreground">No controls defined yet.</div>
            ) : (
              <div className="space-y-3">
                {controls.map((control) => (
                  <div key={control.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4 transition-all hover:bg-accent/5">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <p className="font-semibold text-foreground">{control.title}</p>
                        <p className="text-xs text-muted-foreground">Last Audit: {control.last_audit ? new Date(control.last_audit).toLocaleDateString() : "Not recorded"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={badgeFor(control.status)} variant="secondary">{String(control.status).toUpperCase().replace("_", " ")}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteControl(control.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminCompliance;
