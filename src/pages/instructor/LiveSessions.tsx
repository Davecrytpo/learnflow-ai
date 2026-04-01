import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, Plus, Loader2, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const initialSessions = [
  { id: "LS-144", title: "Capstone Clinic", course: "Product Strategy", date: "Mar 03, 2026", time: "2:00 PM", status: "Scheduled" },
  { id: "LS-142", title: "Activation Metrics Q&A", course: "Growth Analytics", date: "Mar 05, 2026", time: "11:00 AM", status: "Scheduled" },
  { id: "LS-139", title: "Research Panel Review", course: "UX Research", date: "Feb 24, 2026", time: "4:00 PM", status: "Recorded" },
];

const badgeFor = (status: string) => {
  if (status === "Recorded") return "bg-primary/10 text-primary";
  return "bg-emerald-500/10 text-emerald-600";
};

const InstructorLiveSessions = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState(initialSessions);
  const [isScheduling, setIsScheduling] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduling(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsScheduling(false);
    setOpen(false);
    toast({ title: "Session scheduled", description: "Calendar invites have been sent to enrolled learners." });
  };

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Live Sessions</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Synchronous learning</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Schedule live classes, manage recordings, and track attendance.
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-brand text-primary-foreground">
                  <Plus className="mr-2 h-4 w-4" /> Schedule session
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Schedule Live Session</DialogTitle></DialogHeader>
                <form onSubmit={handleSchedule} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Session Title</Label>
                    <Input id="title" placeholder="e.g. Q&A on Module 4" required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" type="time" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isScheduling}>
                      {isScheduling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Meeting
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming sessions</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">Next 14 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recorded</CardTitle>
              <Badge className="bg-primary/10 text-primary" variant="secondary">12</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">Available to learners</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Attendance rate</CardTitle>
              <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">87%</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">87%</p>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <Card className="p-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg">Session schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-0 pb-0">
            {sessions.map((session) => (
              <div key={session.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3 hover:bg-accent/5 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-foreground">{session.title}</p>
                  <p className="text-xs text-muted-foreground">{session.course}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Badge className={badgeFor(session.status)} variant="secondary">{session.status}</Badge>
                  <span className="hidden sm:flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {session.date} Â· {session.time}</span>
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => toast({ title: session.status === "Recorded" ? "Opening Recording" : "Launching Zoom/Teams", description: "Redirecting to stream..." })}>
                    {session.status === "Recorded" ? <Play className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
                    {session.status === "Recorded" ? "Watch" : "Join"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InstructorLiveSessions;


