import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, ShoppingCart } from "lucide-react";

const orders = [
  { id: "MO-2201", item: "Data Literacy Bundle", amount: "$129", status: "Paid", buyer: "Northwind University" },
  { id: "MO-2192", item: "Leadership Sprint", amount: "$89", status: "Paid", buyer: "Cedar Ridge Academy" },
  { id: "MO-2184", item: "AI Ethics Microcourse", amount: "$49", status: "Refunded", buyer: "Waveform Labs" },
];

const badgeFor = (status: string) => {
  if (status === "Paid") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminMarketplaceOrders = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Marketplace Orders</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Transaction operations</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review marketplace purchases, refunds, and vendor payouts.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <ShoppingCart className="mr-2 h-4 w-4" /> Create manual order
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
            <Receipt className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">214</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Refunds</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">6</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">6</p>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendor payout</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">$18.7k</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$18.7k</p>
            <p className="text-xs text-muted-foreground">Next cycle</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Order ledger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{order.item}</p>
                <p className="text-xs text-muted-foreground">{order.buyer}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{order.amount}</span>
                <Badge className={badgeFor(order.status)} variant="secondary">{order.status}</Badge>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminMarketplaceOrders;
