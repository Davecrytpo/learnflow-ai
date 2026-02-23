import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const slots = [
  { id: "OH-11", day: "Tuesday", time: "3:00 PM - 4:00 PM", mode: "Virtual" },
  { id: "OH-09", day: "Thursday", time: "11:00 AM - 12:00 PM", mode: "Virtual" },
];

const InstructorOfficeHours = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Office Hours</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Open Q&A sessions</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Provide open access slots for learner support and guidance.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Clock className="mr-2 h-4 w-4" /> Create slot
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weekly slots</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground">Recurring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Booked</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">12</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">No-shows</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">1</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {slots.map((slot) => (
          <Card key={slot.id} className="p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{slot.day}</p>
                <p className="text-xs text-muted-foreground">{slot.time}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="secondary">{slot.mode}</Badge>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default InstructorOfficeHours;
