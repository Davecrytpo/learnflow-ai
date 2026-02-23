import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Receipt } from "lucide-react";

const invoices = [
  { id: "INV-2026-02", amount: "$28,400", status: "Paid", date: "Feb 10, 2026" },
  { id: "INV-2026-01", amount: "$27,650", status: "Paid", date: "Jan 10, 2026" },
  { id: "INV-2025-12", amount: "$26,990", status: "Pending", date: "Dec 10, 2025" },
];

const badgeFor = (status: string) => {
  if (status === "Paid") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminBilling = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Billing</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Plans and invoices</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Track subscription usage, invoices, and payment status.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <CreditCard className="mr-2 h-4 w-4" /> Update payment method
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current plan</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">Enterprise</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Enterprise</p>
            <p className="text-xs text-muted-foreground">Renews Apr 01, 2026</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly spend</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$28.4k</p>
            <p className="text-xs text-muted-foreground">Last invoice</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open invoices</CardTitle>
            <Receipt className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Pending payment</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Invoices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{invoice.id}</p>
                <p className="text-xs text-muted-foreground">{invoice.date}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{invoice.amount}</span>
                <Badge className={badgeFor(invoice.status)} variant="secondary">{invoice.status}</Badge>
                <Button size="sm" variant="outline">Download</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminBilling;
