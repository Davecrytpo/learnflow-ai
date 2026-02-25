import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, PlusCircle, Search, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminTenants = () => {
  const { toast } = useToast();
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: "", slug: "" });

  const fetchTenants = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tenants")
      .select("*")
      .order("name", { ascending: true });
    setTenants(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenant.name || !newTenant.slug) return;
    setAdding(true);
    
    const { error } = await supabase.from("tenants").insert({
      name: newTenant.name,
      slug: newTenant.slug.toLowerCase().replace(/\s+/g, '-'),
      plan: "growth",
      status: "active",
      seats: 100
    });

    if (error) {
      toast({ title: "Failed to create tenant", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Tenant created", description: `${newTenant.name} is now live.` });
      setNewTenant({ name: "", slug: "" });
      fetchTenants();
    }
    setAdding(false);
  };

  const deleteTenant = async (id: string) => {
    if (!confirm("Are you sure? All data for this tenant will be inaccessible.")) return;
    await supabase.from("tenants").delete().eq("id", id);
    toast({ title: "Tenant removed" });
    fetchTenants();
  };

  const filtered = tenants.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Multi-Tenancy</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Organization Registry</h1>
            <p className="mt-2 text-sm text-muted-foreground">Provision and manage isolated enterprise learning environments.</p>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">New Organization</CardTitle>
              <CardDescription>Setup a new isolated tenant.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    placeholder="Org Name" 
                    value={newTenant.name} 
                    onChange={e => setNewTenant({...newTenant, name: e.target.value})} 
                  />
                  <Input 
                    placeholder="Subdomain / Slug" 
                    value={newTenant.slug} 
                    onChange={e => setNewTenant({...newTenant, slug: e.target.value})} 
                  />
                </div>
                <Button className="w-full" type="submit" disabled={adding || !newTenant.name}>
                  {adding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Provision Tenant
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Active Tenants</CardTitle>
                  <CardDescription>{tenants.length} organizations provisioned.</CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search directory..." 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
                  No tenants found.
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-accent/5 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{t.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{t.slug}.learnflow.ai</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right">
                          <Badge variant="outline" className="text-[10px] uppercase">{t.plan}</Badge>
                          <p className="text-[10px] text-muted-foreground mt-1">{t.seats} seats</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteTenant(t.id)}
                        >
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
      </div>
    </DashboardLayout>
  );
};

export default AdminTenants;
