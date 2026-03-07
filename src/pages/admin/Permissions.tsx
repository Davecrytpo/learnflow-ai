import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, ShieldCheck, UserCog, Plus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const AdminPermissions = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "", level: "custom" });
  const [saving, setSaving] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("permissions_roles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Failed to load roles", description: error.message, variant: "destructive" });
    } else {
      setRoles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name) return;
    setSaving(true);
    
    const { error } = await (supabase.from as any)("permissions_roles").insert(newRole);

    if (error) {
      toast({ title: "Error creating role", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role created", description: `${newRole.name} added successfully.` });
      setOpen(false);
      setNewRole({ name: "", description: "", level: "custom" });
      fetchRoles();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this role?")) return;
    await (supabase.from as any)("permissions_roles").delete().eq("id", id);
    toast({ title: "Role deleted" });
    fetchRoles();
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Permissions</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Access Control</h1>
              <p className="mt-2 text-sm text-muted-foreground">Manage custom roles and platform privileges.</p>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-brand text-primary-foreground">
                  <UserCog className="mr-2 h-4 w-4" /> Create Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New Role Definition</DialogTitle></DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Role Name</Label>
                    <Input value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input value={newRole.description} onChange={e => setNewRole({...newRole, description: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Access Level</Label>
                    <Input value={newRole.level} onChange={e => setNewRole({...newRole, level: e.target.value})} />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Role
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Roles</CardTitle>
              <KeyRound className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{roles.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Policies</CardTitle>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Default</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Role Directory</CardTitle>
            <CardDescription>Custom permission sets configured for this tenant.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : roles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No custom roles found.</div>
            ) : (
              <div className="space-y-3">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-accent/5 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{role.name}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">{role.level}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{role.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">{role.users_count} users</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(role.id)}>
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

export default AdminPermissions;
