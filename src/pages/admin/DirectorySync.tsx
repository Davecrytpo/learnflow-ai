import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RefreshCw, Plus, Users, Loader2, Trash2, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const DirectorySync = () => {
  const { toast } = useToast();
  const [syncs, setSyncs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSync, setNewSync] = useState({ source: "", users_synced: "0" });

  const fetchSyncs = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from as any)("directory_syncs")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Sync failed", description: error.message, variant: "destructive" });
    } else {
      setSyncs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSyncs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await (supabase.from as any)("directory_syncs").insert({
      source: newSync.source,
      users_synced: parseInt(newSync.users_synced),
      status: 'synced'
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sync Connection Added", description: "The directory is now connected." });
      setIsModalOpen(false);
      setNewSync({ source: "", users_synced: "0" });
      fetchSyncs();
    }
    setSaving(false);
  };

  const deleteSync = async (id: string) => {
    if (!confirm("Terminate this directory sync connection?")) return;
    await (supabase.from as any)("directory_syncs").delete().eq("id", id);
    toast({ title: "Connection terminated" });
    fetchSyncs();
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Identity Governance</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Directory Sync</h1>
              <p className="mt-2 text-sm text-muted-foreground">Synchronize institutional user directories (LDAP, Active Directory).</p>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white shadow-lg shadow-primary/20">
                  <Plus className="mr-2 h-4 w-4" /> Connect Directory
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New Directory Connection</DialogTitle></DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Source Name</Label>
                    <Input placeholder="e.g. Campus AD, HR Oracle" value={newSync.source} onChange={e => setNewSync({...newSync, source: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Initial User Count</Label>
                    <Input type="number" value={newSync.users_synced} onChange={e => setNewSync({...newSync, users_synced: e.target.value})} />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Initialize Sync
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Managed Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{syncs.reduce((acc, curr) => acc + (curr.users_synced || 0), 0).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Bridges</CardTitle>
              <RefreshCw className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{syncs.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Directory Connections</CardTitle>
            <CardDescription>Managed institutional data sources for the Global University Institute.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : syncs.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl text-muted-foreground">No directories connected.</div>
            ) : (
              <div className="space-y-3">
                {syncs.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-accent/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Database className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{s.source}</p>
                        <p className="text-xs text-muted-foreground">Last Sync: {new Date(s.last_sync).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right mr-4">
                        <p className="text-xs font-bold text-foreground">{s.users_synced} Users</p>
                        <Badge variant="outline" className="text-[9px] uppercase mt-1">{s.status}</Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteSync(s.id)}>
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

export default DirectorySync;
