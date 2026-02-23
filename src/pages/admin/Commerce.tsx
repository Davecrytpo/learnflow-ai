import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard } from "lucide-react";

const products = [
  { id: "CO-12", name: "Enterprise Plan", revenue: "$28.4k", status: "Active" },
  { id: "CO-10", name: "Pro Plan", revenue: "$9.8k", status: "Active" },
  { id: "CO-07", name: "Growth Add-on", revenue: "$3.1k", status: "Paused" },
];

const badgeFor = (status: string) => {
  if (status === "Active") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const AdminCommerce = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Commerce</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Revenue and checkout</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage pricing, coupons, and subscription health.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <CreditCard className="mr-2 h-4 w-4" /> Create price
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">MRR</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$41.3k</p>
            <p className="text-xs text-muted-foreground">+6.4% MoM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Churn</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">1.2%</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1.2%</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed payments</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">7</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">7</p>
            <p className="text-xs text-muted-foreground">Need follow-up</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Product revenue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {products.map((product) => (
            <div key={product.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.revenue} MRR</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Badge className={badgeFor(product.status)} variant="secondary">{product.status}</Badge>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminCommerce;
