import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Users, Search, Mail, Shield, Trash2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminUsers = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("*"),
      ]);
      
      const combined = (profilesRes.data || []).map(p => ({
        ...p,
        role: rolesRes.data?.find(r => r.user_id === p.user_id)?.role || "student",
        role_id: rolesRes.data?.find(r => r.user_id === p.user_id)?.id,
      }));
      
      setUsers(combined);
    } catch (err: any) {
      toast({ title: "Sync failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (userId: string, currentRoleId: string | undefined, newRole: string) => {
    try {
      // Use upsert to handle both insert and update gracefully
      const { error } = await supabase
        .from("user_roles")
        .upsert(
          { user_id: userId, role: newRole as any },
          { onConflict: 'user_id,role' }
        );

      if (error) throw error;
      
      toast({ title: "Institutional Role updated", description: `User is now assigned as ${newRole}.` });
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Role Update failed", description: err.message, variant: "destructive" });
    }
  };

  const filtered = users.filter(u => 
    (u.display_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.user_id || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Governance</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">User Management</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage identities, roles, and institutional access.</p>
          </div>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Registered Users</CardTitle>
                <CardDescription>All students, instructors, and staff.</CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-muted-foreground font-medium border-b border-border">
                    <tr>
                      <th className="text-left p-4">User</th>
                      <th className="text-left p-4 hidden md:table-cell">Institution</th>
                      <th className="text-left p-4">Current Role</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filtered.map(u => (
                      <tr key={u.id} className="hover:bg-accent/5 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {u.display_name?.[0] || "?"}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{u.display_name || "N/A"}</p>
                              <p className="text-[10px] text-muted-foreground font-mono uppercase truncate max-w-[100px]">{u.user_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <p className="text-muted-foreground">{u.institution || "Personal"}</p>
                        </td>
                        <td className="p-4">
                          <Select value={u.role} onValueChange={(v) => changeRole(u.user_id, u.role_id, v)}>
                            <SelectTrigger className="h-8 w-32 border-none bg-transparent hover:bg-accent/10 focus:ring-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="instructor">Instructor</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <ShieldAlert className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
