import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Download, Loader2, Trash2, FileJson, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";

const DataExports = () => {
  const { toast } = useToast();
  const [exports, setExports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newExport, setNewExport] = useState({ name: "", format: "csv" });

  const fetchExports = async () => {
    setLoading(true);
    try {
      const data = await apiClient.db.from("data_exports").select("*").order("created_at", { ascending: false }).execute();
      setExports(data || []);
    } catch (error: any) {
      toast({ title: "Export load failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExports();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await apiClient.db.from("data_exports").insert({
        name: newExport.name,
        format: newExport.format,
        status: "completed",
      }).execute();
      toast({ title: "Export Ready", description: "Your data bundle has been generated." });
      setIsModalOpen(false);
      setNewExport({ name: "", format: "csv" });
      await fetchExports();
    } catch (error: any) {
      toast({ title: "Export failed", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteExport = async (id: string) => {
    try {
      await apiClient.db.from("data_exports").delete().eq("id", id).execute();
      toast({ title: "Export removed" });
      await fetchExports();
    } catch (error: any) {
      toast({ title: "Export removal failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Data Management</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Institutional Exports</h1>
              <p className="mt-2 text-sm text-muted-foreground">Generate and download academic and financial data bundles.</p>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white shadow-lg shadow-primary/20">
                  <Database className="mr-2 h-4 w-4" /> New Export
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Generate Data Export</DialogTitle></DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Export Name</Label>
                    <Input placeholder="e.g. Q1_Tuition_Report" value={newExport.name} onChange={(e) => setNewExport({ ...newExport, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select value={newExport.format} onValueChange={(value) => setNewExport({ ...newExport, format: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                        <SelectItem value="json">JSON Object</SelectItem>
                        <SelectItem value="xml">XML Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Generate Bundle
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Recent Exports</CardTitle>
            <CardDescription>Generated institutional data archives.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : exports.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed py-12 text-center text-muted-foreground">No exports found.</div>
            ) : (
              <div className="space-y-3">
                {exports.map((exportItem) => (
                  <div key={exportItem.id} className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-4 transition-all hover:bg-accent/5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {exportItem.format === "json" ? <FileJson className="h-5 w-5" /> : <FileSpreadsheet className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{exportItem.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {exportItem.created_at ? new Date(exportItem.created_at).toLocaleString() : "Unknown"} • {String(exportItem.format || "csv").toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteExport(exportItem.id)}>
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

export default DataExports;
