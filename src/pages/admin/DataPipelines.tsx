import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Network, Plus, Loader2, Trash2, Play, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";

const DataPipelines = () => {
  const { toast } = useToast();
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newPipeline, setNewPipeline] = useState({ name: "", source: "", destination: "" });

  const fetchPipelines = async () => {
    setLoading(true);
    try {
      const data = await apiClient.db.from("data_pipelines").select("*").order("created_at", { ascending: false }).execute();
      setPipelines(data || []);
    } catch (error: any) {
      toast({ title: "Operation failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await apiClient.db.from("data_pipelines").insert({
        ...newPipeline,
        status: "active",
      }).execute();
      toast({ title: "Pipeline Activated", description: "Data flow has been initialized." });
      setIsModalOpen(false);
      setNewPipeline({ name: "", source: "", destination: "" });
      await fetchPipelines();
    } catch (error: any) {
      toast({ title: "Operation failed", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deletePipeline = async (id: string) => {
    try {
      await apiClient.db.from("data_pipelines").delete().eq("id", id).execute();
      toast({ title: "Pipeline removed" });
      await fetchPipelines();
    } catch (error: any) {
      toast({ title: "Operation failed", description: error.message, variant: "destructive" });
    }
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
                    <Input placeholder="e.g. Student SIS Sync" value={newPipeline.name} onChange={(e) => setNewPipeline({ ...newPipeline, name: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Source</Label>
                      <Input placeholder="Origin system" value={newPipeline.source} onChange={(e) => setNewPipeline({ ...newPipeline, source: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Destination</Label>
                      <Input placeholder="Target system" value={newPipeline.destination} onChange={(e) => setNewPipeline({ ...newPipeline, destination: e.target.value })} required />
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
              <div className="rounded-2xl border-2 border-dashed py-12 text-center text-muted-foreground">No pipelines configured.</div>
            ) : (
              <div className="space-y-3">
                {pipelines.map((pipeline) => (
                  <div key={pipeline.id} className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-4 transition-all hover:bg-accent/5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Network className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{pipeline.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {pipeline.source}
                          {" -> "}
                          {pipeline.destination}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="mr-4 hidden text-right sm:block">
                        <Badge variant="outline" className="flex items-center gap-1 text-[10px] uppercase">
                          <CheckCircle className="h-2 w-2 text-emerald-500" /> {pipeline.status}
                        </Badge>
                        <p className="mt-1 text-[10px] text-muted-foreground">Healthy</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deletePipeline(pipeline.id)}>
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
