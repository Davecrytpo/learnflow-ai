import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LifeBuoy, MessageSquare } from "lucide-react";

const tickets = [
  { id: "SUP-441", subject: "SSO login failure", priority: "High", status: "Open" },
  { id: "SUP-433", subject: "Marketplace refund", priority: "Medium", status: "In progress" },
  { id: "SUP-419", subject: "Course sync delay", priority: "Low", status: "Resolved" },
];

const badgeFor = (priority: string) => {
  if (priority === "High") return "bg-destructive/10 text-destructive";
  if (priority === "Medium") return "bg-amber-500/10 text-amber-600";
  return "bg-emerald-500/10 text-emerald-600";
};

const AdminSupportCenter = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Support Center</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Customer operations</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage tickets, SLAs, and resolution workflows.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <MessageSquare className="mr-2 h-4 w-4" /> New ticket
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open tickets</CardTitle>
            <LifeBuoy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">14</p>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">SLA risk</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">3</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CSAT</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">4.7</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4.7</p>
            <p className="text-xs text-muted-foreground">Rolling 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Ticket queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{ticket.subject}</p>
                <p className="text-xs text-muted-foreground">Status: {ticket.status}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Badge className={badgeFor(ticket.priority)} variant="secondary">{ticket.priority}</Badge>
                <Button size="sm" variant="outline">Open</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminSupportCenter;
