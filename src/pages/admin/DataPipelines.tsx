import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Network, Plus, Loader2, Trash2, Database, Play, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const DataPipelines = () => {
  const { toast } = useToast();
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newPipeline, setNewPipeline] = useState({ name: "", source: "", destination: "" });

  const fetchPipelines = async () => {
    setLoading(true);
    const { data } = await (supabase
      .from as any)("data_pipelines")
      .select("*")
      .order("created_at", { ascending: false });
    setPipelines(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPipelines();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("data_pipelines").insert({
      ...newPipeline,
      status: 'active'
    });
    if (error) {
      toast({ title: "Operation failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Pipeline Activated", description: "Data flow has been initialized." });
      setIsModalOpen(false);
      setNewPipeline({ name: "", source: "", destination: "" });
      fetchPipelines();
    }
    setSaving(false);
  };

  const deletePipeline = async (id: string) => {
    await supabase.from("data_pipelines").delete().eq("id", id);
    toast({ title: "Pipeline removed" });
    fetchPipelines();
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">System Integration</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Data Pipelines</h1>
              <p className="mt-2 text-sm text-muted-foreground">Automate academic and operational data flows across institutional systems.</p>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white shadow-lg shadow-primary/20">
                  <Plus className="mr-2 h-4 w-4" /> New Pipeline
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Configure Data Pipeline</DialogTitle></DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Pipeline Name</Label>
                    <Input placeholder="e.g. Student SIS Sync" value={newPipeline.name} onChange={e => setNewPipeline({...newPipeline, name: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Source</Label>
                      <Input placeholder="Origin system" value={newPipeline.source} onChange={e => setNewPipeline({...newPipeline, source: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Destination</Label>
                      <Input placeholder="Target system" value={newPipeline.destination} onChange={e => setNewPipeline({...newPipeline, destination: e.target.value})} required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Initialize
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Active Bridges</CardTitle>
            <CardDescription>Managed data synchronization pathways.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : pipelines.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl text-muted-foreground">No pipelines configured.</div>
            ) : (
              <div className="space-y-3">
                {pipelines.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-accent/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Network className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.source} → {p.destination}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block text-right mr-4">
                        <Badge variant="outline" className="text-[10px] uppercase flex items-center gap-1">
                          <CheckCircle className="h-2 w-2 text-emerald-500" /> {p.status}
                        </Badge>
                        <p className="text-[10px] text-muted-foreground mt-1">Healthy</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deletePipeline(p.id)}>
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

export default DataPipelines;
