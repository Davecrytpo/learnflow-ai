import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LifeBuoy, Search, Loader2, Trash2, User, MessageCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const SupportCenter = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTickets = async () => {
    setLoading(true);
    const { data } = await (supabase
      .from as any)("support_tickets")
      .select(`
        *,
        profiles:user_id (display_name)
      `)
      .order("created_at", { ascending: false });
    setTickets(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const resolveTicket = async (id: string) => {
    await (supabase.from as any)("support_tickets").update({ status: 'resolved' }).eq("id", id);
    toast({ title: "Ticket Resolved" });
    fetchTickets();
  };

  const deleteTicket = async (id: string) => {
    await (supabase.from as any)("support_tickets").delete().eq("id", id);
    toast({ title: "Ticket Deleted" });
    fetchTickets();
  };

  const filtered = tickets.filter(t => 
    t.subject.toLowerCase().includes(search.toLowerCase()) || 
    (t.profiles?.display_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Student Success</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Support Command Center</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage institutional support requests from students and faculty.</p>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Tickets</CardTitle>
              <MessageCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'open').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Response</CardTitle>
              <Clock className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2.4h</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Inquiry Queue</CardTitle>
                <CardDescription>Priority-sorted list of incoming requests.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search subject or user..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl text-muted-foreground">No tickets in queue.</div>
            ) : (
              <div className="space-y-3">
                {filtered.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-accent/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <LifeBuoy className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{t.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{t.profiles?.display_name || "User"}</span>
                          <span className="text-[10px] text-muted-foreground opacity-50">• {new Date(t.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={t.priority === 'high' ? 'destructive' : 'outline'} className="text-[10px] uppercase">{t.priority}</Badge>
                      <Badge variant="secondary" className="text-[10px] uppercase">{t.status}</Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => resolveTicket(t.id)}>Resolve</Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteTicket(t.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
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

export default SupportCenter;
