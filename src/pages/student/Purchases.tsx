import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CreditCard } from "lucide-react";

const orders = [
  { id: "ORD-7421", item: "Data Literacy Bundle", amount: "$129", status: "Paid", date: "Feb 10, 2026" },
  { id: "ORD-7390", item: "Leadership Sprint", amount: "$89", status: "Paid", date: "Jan 22, 2026" },
  { id: "ORD-7355", item: "AI Ethics Microcourse", amount: "$49", status: "Refunded", date: "Jan 10, 2026" },
];

const badgeFor = (status: string) => {
  if (status === "Paid") return "bg-emerald-500/10 text-emerald-600";
  return "bg-amber-500/10 text-amber-600";
};

const StudentPurchases = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Purchases</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Marketplace orders</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review receipts, manage subscriptions, and download invoices.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <CreditCard className="mr-2 h-4 w-4" /> Update payment method
          </Button>
        </div>
      </section>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total spend</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$267</p>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active items</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">3</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Available in library</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Refunds</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">1</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Processed</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Order history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{order.item}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{order.amount}</span>
                <Badge className={badgeFor(order.status)} variant="secondary">{order.status}</Badge>
                <Button size="sm" variant="outline">Receipt</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default StudentPurchases;
