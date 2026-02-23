import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkCheck, Play, Star } from "lucide-react";

const bookmarks = [
  { id: "B-88", title: "North Star Metric Workshop", course: "Product Strategy", type: "Lesson" },
  { id: "B-84", title: "Customer Interview Script", course: "UX Research", type: "Resource" },
  { id: "B-77", title: "Activation Sprint Checklist", course: "Growth Analytics", type: "Template" },
];

const StudentBookmarks = () => (
  <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Bookmarks</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Saved learning assets</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Keep your best lessons, templates, and resources in one place.
            </p>
          </div>
          <BookmarkCheck className="h-10 w-10 text-primary" />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saved items</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">12</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Across courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top rated</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground">Five-star resources</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recently used</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">6</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">6</p>
            <p className="text-xs text-muted-foreground">In last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {bookmarks.map((item) => (
          <Card key={item.id} className="p-4">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.course}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="secondary">{item.type}</Badge>
                <Button size="sm" variant="outline">
                  <Play className="mr-2 h-3 w-3" /> Open
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default StudentBookmarks;
