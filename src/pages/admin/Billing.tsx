import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Receipt, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

const AdminBilling = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0 });

  const fetchBilling = async () => {
    setLoading(true);
    try {
      const data = await apiClient.db.from("billing_invoices").select("*").order("created_at", { ascending: false }).execute();
      setInvoices(data || []);
      setStats({
        total: (data || []).reduce((acc: number, invoice: any) => acc + Number(invoice.amount || 0), 0),
        pending: (data || []).filter((invoice: any) => invoice.status === "pending").length,
      });
    } catch (error: any) {
      toast({ title: "Error loading billing", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const badgeFor = (status: string) => {
    if (status === "paid") return "bg-emerald-500/10 text-emerald-600";
    if (status === "pending") return "bg-amber-500/10 text-amber-600";
    return "bg-destructive/10 text-destructive";
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Finance</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Billing & Invoices</h1>
              <p className="mt-2 text-sm text-muted-foreground">Manage subscription plans and payment history.</p>
            </div>
            <Button className="bg-gradient-brand text-primary-foreground">
              <CreditCard className="mr-2 h-4 w-4" /> Manage Payment Method
            </Button>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Plan</CardTitle>
              <Badge className="bg-primary/10 text-primary">Enterprise</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Active</p>
              <p className="text-xs text-muted-foreground">Renews annually</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${stats.total.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Lifetime volume</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Invoices</CardTitle>
              <Receipt className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Action required</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>All transactions and receipts.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : invoices.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No invoices found.</div>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-4 transition-all hover:bg-accent/5">
                    <div>
                      <p className="font-semibold text-foreground">{invoice.invoice_id || invoice.id}</p>
                      <p className="text-xs text-muted-foreground">{invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : "Unknown"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-medium">${invoice.amount || 0}</span>
                      <Badge className={badgeFor(invoice.status)} variant="secondary">{invoice.status}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
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

export default AdminBilling;
