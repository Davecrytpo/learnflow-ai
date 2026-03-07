import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Key, Plus, ShieldCheck, Loader2, Trash2, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SSOProvisioning = () => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: "", protocol: "SAML", status: "active" });

  const fetchProviders = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from as any)("sso_providers")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Sync failed", description: error.message, variant: "destructive" });
    } else {
      setProviders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await (supabase.from as any)("sso_providers").insert(newProvider);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Provider added", description: "Identity provider registered successfully." });
      setIsModalOpen(false);
      setNewProvider({ name: "", protocol: "SAML", status: "active" });
      fetchProviders();
    }
    setSaving(false);
  };

  const deleteProvider = async (id: string) => {
    if (!confirm("Remove this SSO configuration?")) return;
    await supabase.from("sso_providers").delete().eq("id", id);
    toast({ title: "Configuration removed" });
    fetchProviders();
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Security Architecture</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">SSO Provisioning</h1>
              <p className="mt-2 text-sm text-muted-foreground">Manage centralized authentication and SAML/OIDC identity providers.</p>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white shadow-lg shadow-primary/20">
                  <Plus className="mr-2 h-4 w-4" /> Add Provider
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Configure Identity Provider</DialogTitle></DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Provider Name</Label>
                    <Input placeholder="e.g. Azure AD, Okta" value={newProvider.name} onChange={e => setNewProvider({...newProvider, name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Protocol</Label>
                    <Select value={newProvider.protocol} onValueChange={v => setNewProvider({...newProvider, protocol: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAML">SAML 2.0</SelectItem>
                        <SelectItem value="OIDC">OpenID Connect</SelectItem>
                        <SelectItem value="OAuth">OAuth 2.0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Provider
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Connections</CardTitle>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{providers.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Security Status</CardTitle>
              <Badge className="bg-primary/10 text-primary">Hardened</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Encrypted</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Identity Providers</CardTitle>
            <CardDescription>Managed authentication services for the Global University Institute.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : providers.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl text-muted-foreground">No providers configured.</div>
            ) : (
              <div className="space-y-3">
                {providers.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-accent/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Key className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono uppercase">{p.protocol}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-[10px] uppercase">{p.status}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteProvider(p.id)}>
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

export default SSOProvisioning;
