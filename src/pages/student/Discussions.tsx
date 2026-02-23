import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Flame, Eye } from "lucide-react";

const threads = [
  { id: "D-901", title: "How are you structuring your capstone?", course: "Product Strategy", replies: 18, views: 245, trending: true },
  { id: "D-892", title: "Sprint planning pitfalls we keep repeating", course: "Agile Foundations", replies: 10, views: 168, trending: false },
  { id: "D-880", title: "Best sources for market sizing data?", course: "Market Research", replies: 25, views: 334, trending: true },
];

const StudentDiscussions = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Discussions</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Join the learning community</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask questions, share takeaways, and learn from peers.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <MessageSquare className="mr-2 h-4 w-4" /> New thread
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {threads.map((thread) => (
            <Card key={thread.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{thread.title}</p>
                    {thread.trending && (
                      <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">
                        <Flame className="mr-1 h-3 w-3" /> Trending
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{thread.course}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{thread.replies} replies</span>
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {thread.views}</span>
                  <Button size="sm" variant="outline">Open</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg">Start a new topic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-0 pb-0">
            <Input placeholder="Thread title" />
            <Input placeholder="Course tag" />
            <Textarea placeholder="Share your question or insight..." className="min-h-[140px]" />
            <Button className="w-full">Post to forum</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </DashboardLayout>
);

export default StudentDiscussions;
