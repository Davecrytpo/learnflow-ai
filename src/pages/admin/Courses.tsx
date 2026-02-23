import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, BookOpen } from "lucide-react";

const AdminCourses = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, title, category, published, created_at")
        .order("created_at", { ascending: false });
      setCourses(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = courses.filter(c => (c.title || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Courses</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Course moderation</h1>
            <p className="mt-2 text-sm text-muted-foreground">Monitor published and draft content.</p>
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">All courses</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Search courses" value={search} onChange={(e) => setSearch(e.target.value)} />
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : (
              <div className="space-y-2">
                {filtered.map(c => (
                  <div key={c.id} className="rounded-xl border border-border p-3 text-sm">
                    <p className="font-medium text-foreground">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.category || "General"} - {c.published ? "Published" : "Draft"}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminCourses;
