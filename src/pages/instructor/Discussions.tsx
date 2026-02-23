import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Flag, MessageSquare, ShieldCheck } from "lucide-react";

const threads = [
  { id: "D-1201", title: "Capstone scope clarification", course: "Product Strategy", reports: 0, replies: 22, status: "Open" },
  { id: "D-1194", title: "Sprint planning format suggestions", course: "Agile Foundations", reports: 1, replies: 14, status: "Monitored" },
  { id: "D-1187", title: "Market sizing sources", course: "Market Research", reports: 3, replies: 31, status: "Flagged" },
];

const badgeFor = (status: string) => {
  if (status === "Open") return "bg-emerald-500/10 text-emerald-600";
  if (status === "Monitored") return "bg-amber-500/10 text-amber-600";
  return "bg-destructive/10 text-destructive";
};

const InstructorDiscussions = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Discussions</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Moderate and guide dialogue</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Highlight best answers, resolve flags, and keep conversations healthy.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <MessageSquare className="mr-2 h-4 w-4" /> Post announcement
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open threads</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">42</p>
            <p className="text-xs text-muted-foreground">Across cohorts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flagged</CardTitle>
            <Flag className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved today</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">7</p>
            <p className="text-xs text-muted-foreground">Moderation actions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Thread monitor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Search discussions" className="max-w-xs" />
            <Button variant="outline">Filters</Button>
            <Button variant="ghost">Assign moderator</Button>
          </div>
          <div className="space-y-3">
            {threads.map((thread) => (
              <div key={thread.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{thread.title}</p>
                  <p className="text-xs text-muted-foreground">{thread.course}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{thread.replies} replies</span>
                  <span>{thread.reports} reports</span>
                  <Badge className={badgeFor(thread.status)} variant="secondary">{thread.status}</Badge>
                  <Button size="sm" variant="outline">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default InstructorDiscussions;
