import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, DollarSign, Loader2, Trash2, Search, User, Receipt, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const AdminCommerce = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("marketplace_orders")
      .select(`
        *,
        profiles:buyer_id (display_name),
        marketplace_listings:listing_id (title)
      `)
      .order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const refundOrder = async (id: string) => {
    if (!confirm("Issue a full refund for this order?")) return;
    await supabase.from("marketplace_orders").update({ status: 'refunded' }).eq("id", id);
    toast({ title: "Order Refunded", description: "The transaction has been reversed." });
    fetchOrders();
  };

  const filtered = orders.filter(o => 
    (o.profiles?.display_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.marketplace_listings?.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    revenue: orders.reduce((acc, curr) => acc + Number(curr.amount || 0), 0),
    active: orders.filter(o => o.status === 'completed').length,
    pending: orders.filter(o => o.status === 'pending').length
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Financial Operations</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Commerce & Transactions</h1>
              <p className="mt-2 text-sm text-muted-foreground">Monitor marketplace revenue, student purchases, and fulfillment status.</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gross Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{orders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
              <Badge className="bg-emerald-500/10 text-emerald-600">Merchant Active</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Stable</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Transaction Registry</CardTitle>
                <CardDescription>Full audit trail of platform commerce.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search buyer or item..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl text-muted-foreground">No transactions recorded.</div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-muted-foreground font-medium border-b border-border">
                    <tr>
                      <th className="text-left p-4">Transaction</th>
                      <th className="text-left p-4">Buyer</th>
                      <th className="text-left p-4">Amount</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filtered.map(o => (
                      <tr key={o.id} className="hover:bg-accent/5 transition-colors">
                        <td className="p-4">
                          <p className="font-semibold text-foreground">{o.marketplace_listings?.title || "Course Access"}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{new Date(o.created_at).toLocaleString()}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium text-xs">{o.profiles?.display_name || "Scholar"}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-600">
                          ${o.amount}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Badge variant="secondary" className="text-[9px] uppercase">{o.status}</Badge>
                            <Button size="sm" variant="ghost" className="h-7 text-[10px] text-destructive hover:bg-destructive/10" onClick={() => refundOrder(o.id)}>Refund</Button>
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

export default AdminCommerce;
