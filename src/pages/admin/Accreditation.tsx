import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2, Trash2, Calendar, Plus } from "lucide-react";
import GraduationCapIcon from "@/components/icons/GraduationCapIcon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminAccreditation = () => {
  const { toast } = useToast();
  const [accreditations, setAccreditations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newAccreditation, setNewAccreditation] = useState({
    agency: "",
    status: "active",
    renewal_date: ""
  });

  const fetchAccreditations = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from as any)("accreditations")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    } else {
      setAccreditations(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAccreditations();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await (supabase.from as any)("accreditations").insert({
      agency: newAccreditation.agency,
      status: newAccreditation.status,
      renewal_date: newAccreditation.renewal_date || null
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Accreditation added", description: "Record successfully updated." });
      setOpen(false);
      setNewAccreditation({ agency: "", status: "active", renewal_date: "" });
      fetchAccreditations();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this accreditation record?")) return;
    await (supabase.from as any)("accreditations").delete().eq("id", id);
    toast({ title: "Record deleted" });
    fetchAccreditations();
  };

  const badgeFor = (status: string) => {
    if (status === "active") return "bg-emerald-500/10 text-emerald-600";
    if (status === "review") return "bg-amber-500/10 text-amber-600";
    return "bg-destructive/10 text-destructive";
  };

  const stats = {
    active: accreditations.filter(a => a.status === 'active').length,
    review: accreditations.filter(a => a.status === 'review').length,
    expired: accreditations.filter(a => a.status === 'expired').length,
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Quality Assurance</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Accreditation Manager</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Track agency certifications, renewal cycles, and institutional compliance status.
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-brand text-primary-foreground shadow-lg shadow-primary/20">
                  <Plus className="mr-2 h-4 w-4" /> Add Record
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New Accreditation Record</DialogTitle></DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Accrediting Agency</Label>
                    <Input 
                      placeholder="e.g. AACSB, ABET" 
                      value={newAccreditation.agency}
                      onChange={e => setNewAccreditation({...newAccreditation, agency: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={newAccreditation.status} onValueChange={(v) => setNewAccreditation({...newAccreditation, status: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="review">In Review</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Renewal Date</Label>
                      <Input 
                        type="date" 
                        value={newAccreditation.renewal_date}
                        onChange={e => setNewAccreditation({...newAccreditation, renewal_date: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Record
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Certifications</CardTitle>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Verified agencies</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">{stats.review}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.review}</p>
              <p className="text-xs text-muted-foreground">Action required</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tracked</CardTitle>
              <GraduationCapIcon className="h-4 w-4 text-primary" />

            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{accreditations.length}</p>
              <p className="text-xs text-muted-foreground">Global standards</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Accreditation Status</CardTitle>
            <CardDescription>Comprehensive list of tracked institutional quality standards.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : accreditations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">No accreditation records found.</div>
            ) : (
              <div className="space-y-3">
                {accreditations.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-accent/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {item.agency.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{item.agency}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Renewal: {item.renewal_date ? new Date(item.renewal_date).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={badgeFor(item.status)} variant="secondary">{item.status.toUpperCase()}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
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

export default AdminAccreditation;
