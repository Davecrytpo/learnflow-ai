import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Search, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

const AdminCourses = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await apiClient.fetch("/instructor/courses");
      setCourses(data || []);
    } catch (error: any) {
      toast({ title: "Course load failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = useMemo(() => {
    return courses.filter((course) =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      (course.category || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [courses, search]);

  const togglePublish = async (course: any) => {
    try {
      await apiClient.fetch(`/admin/courses/${course.id || course._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          published: !course.published,
          status: !course.published ? "approved" : "pending"
        })
      });
      toast({ title: !course.published ? "Course published" : "Course moved back to pending" });
      fetchCourses();
    } catch (error: any) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Catalog Control</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Course catalog</h1>
            <p className="mt-2 text-sm text-muted-foreground">Review course publication status and approval state.</p>
          </div>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">All courses</CardTitle>
                <CardDescription>{courses.length} total course records</CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by title or category" className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed py-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">No courses found.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-secondary/40 text-muted-foreground">
                    <tr>
                      <th className="p-4 text-left">Course</th>
                      <th className="p-4 text-left hidden md:table-cell">Status</th>
                      <th className="p-4 text-left hidden md:table-cell">Updated</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filtered.map((course) => (
                      <tr key={course.id || course._id} className="hover:bg-accent/5">
                        <td className="p-4">
                          <p className="font-semibold text-foreground">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.category || "Academic"}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            course.published ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                          }`}>
                            {course.published ? "Live" : course.status || "Pending"}
                          </span>
                        </td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground">
                          {course.updated_at ? new Date(course.updated_at).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => togglePublish(course)} title={course.published ? "Unpublish" : "Publish"}>
                            {course.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
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
