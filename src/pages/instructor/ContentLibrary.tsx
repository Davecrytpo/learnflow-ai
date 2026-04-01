import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LibraryBig, UploadCloud, Search, Loader2, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

const InstructorContentLibrary = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [form, setForm] = useState({ course_id: "", title: "", url: "", type: "link" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [courseData, assetRes] = await Promise.all([
        apiClient.fetch("/instructor/courses"),
        apiClient.db.from("course_resources").select("*").order("created_at", { ascending: false }).execute()
      ]);

      setCourses(courseData || []);
      setAssets(assetRes.data || []);
    } catch (error: any) {
      toast({ title: "Content library load failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAssets = useMemo(() => {
    const courseMap = new Map(courses.map((course) => [course.id || course._id, course.title]));
    return assets
      .map((asset) => ({
        ...asset,
        courseTitle: courseMap.get(asset.course_id) || "Untitled Course"
      }))
      .filter((asset) => {
        const needle = search.toLowerCase();
        return asset.title?.toLowerCase().includes(needle) || asset.type?.toLowerCase().includes(needle) || asset.courseTitle.toLowerCase().includes(needle);
      });
  }, [assets, courses, search]);

  const createAsset = async () => {
    if (!form.course_id || !form.title || !form.url) {
      return;
    }

    setSaving(true);
    try {
      const response = await apiClient.db.from("course_resources").insert({
        course_id: form.course_id,
        title: form.title,
        url: form.url,
        type: form.type
      }).execute();

      setAssets((current) => [response.data, ...current].flat().filter(Boolean));
      setOpen(false);
      setForm({ course_id: "", title: "", url: "", type: "link" });
      toast({ title: "Resource added" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      await apiClient.db.from("course_resources").delete().eq("id", id).execute();
      setAssets((current) => current.filter((asset) => (asset.id || asset._id) !== id));
      toast({ title: "Resource removed" });
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-8 pb-24">
        <section className="rounded-[2.5rem] border border-slate-800 bg-slate-950 p-8 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Content Library</p>
              <h1 className="mt-2 font-display text-3xl font-bold">Reusable course assets</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Store course links, files, and learning references attached to real instructor courses.
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                  <UploadCloud className="mr-2 h-4 w-4" /> Add asset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add course resource</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label>Course</Label>
                    <Select value={form.course_id} onValueChange={(value) => setForm({ ...form, course_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id || course._id} value={course.id || course._id}>{course.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Title</Label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Resource URL</Label>
                    <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="link">Link</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="template">Template</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={createAsset} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save resource
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Assets</CardTitle>
              <LibraryBig className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{assets.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Courses covered</CardTitle>
              <Badge variant="secondary">{new Set(assets.map((item) => item.course_id)).size}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{new Set(assets.map((item) => item.course_id)).size}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Links ready</CardTitle>
              <Badge variant="secondary">{assets.filter((item) => Boolean(item.url)).length}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{assets.filter((item) => Boolean(item.url)).length}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Asset library</CardTitle>
            <CardDescription>Resources persisted in the shared backend store.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assets" className="pl-9" />
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                No resources found.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAssets.map((asset) => (
                  <div key={asset.id || asset._id} className="flex flex-col gap-4 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{asset.title}</p>
                      <p className="text-xs text-muted-foreground">{asset.type || "resource"} in {asset.courseTitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{asset.type || "link"}</Badge>
                      <Button size="sm" variant="outline" asChild>
                        <a href={asset.url} target="_blank" rel="noreferrer">Open</a>
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteAsset(asset.id || asset._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default InstructorContentLibrary;
