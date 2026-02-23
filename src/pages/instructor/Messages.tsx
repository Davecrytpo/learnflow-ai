import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, UserRound } from "lucide-react";

const inbox = [
  { id: "IM-210", from: "Cohort Lead", subject: "Week 6 live session agenda", time: "1h ago", unread: true },
  { id: "IM-205", from: "Student: Omar A.", subject: "Question about grading rubric", time: "Yesterday", unread: true },
  { id: "IM-198", from: "Support", subject: "SCORM import completed", time: "Feb 20", unread: false },
];

const InstructorMessages = () => (
  <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Messages</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Instructor inbox</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Keep instructor communications organized and respond quickly.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="p-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg">Inbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-0 pb-0">
            {inbox.map((msg) => (
              <div key={msg.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <UserRound className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{msg.from}</p>
                    <p className="text-xs text-muted-foreground">{msg.subject}</p>
                  </div>
                </div>
                <div className="text-right">
                  {msg.unread && (
                    <Badge className="mb-1 bg-primary/10 text-primary" variant="secondary">New</Badge>
                  )}
                  <p className="text-[10px] text-muted-foreground">{msg.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg">Compose</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-0 pb-0">
            <Input placeholder="Recipient or cohort" />
            <Input placeholder="Subject" />
            <Textarea placeholder="Write your message..." className="min-h-[160px]" />
            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" /> Send message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </DashboardLayout>
);

export default InstructorMessages;
