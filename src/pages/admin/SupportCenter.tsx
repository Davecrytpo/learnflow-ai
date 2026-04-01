import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LifeBuoy, Search, Loader2, Trash2, User, MessageCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";

const SupportCenter = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const [data, users] = await Promise.all([
        apiClient.db.from("support_tickets").select("*").order("created_at", { ascending: false }).execute(),
        apiClient.fetch("/admin/users"),
      ]);

      const userMap = new Map((users || []).map((user: any) => [user._id || user.id, user]));
      setTickets(
        (data || []).map((ticket: any) => ({
          ...ticket,
          user: userMap.get(ticket.user_id) || null,
        })),
      );
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const resolveTicket = async (id: string) => {
    try {
      await apiClient.db.from("support_tickets").update({ status: "resolved" }).eq("id", id).execute();
      toast({ title: "Ticket Resolved" });
      await fetchTickets();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const deleteTicket = async (id: string) => {
    try {
      await apiClient.db.from("support_tickets").delete().eq("id", id).execute();
      toast({ title: "Ticket Deleted" });
      await fetchTickets();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filtered = tickets.filter((ticket) =>
    [ticket.subject, ticket.user?.display_name, ticket.user?.email]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
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
              <p className="text-2xl font-bold">{tickets.filter((ticket) => ticket.status === "open").length}</p>
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
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <CardTitle>Inquiry Queue</CardTitle>
                <CardDescription>Priority-sorted list of incoming requests.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search subject or user..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed py-12 text-center text-muted-foreground">No tickets in queue.</div>
            ) : (
              <div className="space-y-3">
                {filtered.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-4 transition-all hover:bg-accent/5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <LifeBuoy className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{ticket.subject}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{ticket.user?.display_name || ticket.user?.email || "User"}</span>
                          <span className="text-[10px] text-muted-foreground opacity-50">• {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "Unknown"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={ticket.priority === "high" ? "destructive" : "outline"} className="text-[10px] uppercase">{ticket.priority || "normal"}</Badge>
                      <Badge variant="secondary" className="text-[10px] uppercase">{ticket.status}</Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => resolveTicket(ticket.id)}>Resolve</Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteTicket(ticket.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
