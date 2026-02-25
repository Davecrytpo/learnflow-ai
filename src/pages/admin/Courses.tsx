import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Search, Eye, EyeOff, Trash2, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminCourses = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*, profiles:author_id(display_name)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setCourses(data || []);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const togglePublish = async (courseId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("courses")
      .update({ published: !currentStatus })
      .eq("id", courseId);
    
    if (error) {
      toast({ title: "Update failed", variant: "destructive" });
    } else {
      toast({ title: currentStatus ? "Course unpublished" : "Course published" });
      fetchCourses();
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!window.confirm("Delete this course permanently?")) return;
    
    const { error } = await supabase.from("courses").delete().eq("id", courseId);
    if (error) {
      toast({ title: "Delete failed", variant: "destructive" });
    } else {
      toast({ title: "Course deleted" });
      fetchCourses();
    }
  };

  const filtered = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.profiles?.display_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Content Moderation</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Course Catalog</h1>
            <p className="mt-2 text-sm text-muted-foreground">Monitor and manage all educational content on the platform.</p>
          </div>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Platform Courses</CardTitle>
                <CardDescription>Total: {courses.length} courses published</CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Filter by title or instructor..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">No courses found matching your criteria.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-muted-foreground font-medium border-b border-border">
                    <tr>
                      <th className="text-left p-4">Course Info</th>
                      <th className="text-left p-4 hidden md:table-cell">Instructor</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filtered.map(c => (
                      <tr key={c.id} className="hover:bg-accent/5 transition-colors group">
                        <td className="p-4">
                          <p className="font-semibold text-foreground line-clamp-1">{c.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{c.category || "Uncategorized"}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <p className="text-muted-foreground">{c.profiles?.display_name || "N/A"}</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            c.published ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                          }`}>
                            {c.published ? "Live" : "Draft"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                              onClick={() => togglePublish(c.id, c.published)}
                              title={c.published ? "Unpublish" : "Publish"}
                            >
                              {c.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => deleteCourse(c.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminCourses;
