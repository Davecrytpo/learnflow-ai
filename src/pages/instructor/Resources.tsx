import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InstructorResources = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [resources, setResources] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("link");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await api.get("/instructor/courses");
        setCourses(response.data || []);
        if (response.data && response.data.length > 0) setSelectedCourse(response.data[0]._id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  useEffect(() => {
    if (!selectedCourse) return;
    const fetch = async () => {
      try {
        const response = await api.get("/resources", { params: { course_id: selectedCourse } });
        setResources(response.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [selectedCourse]);

  const addResource = async () => {
    if (!selectedCourse || !title || !url) return;
    setSaving(true);
    try {
      const response = await api.post("/resources", {
        course_id: selectedCourse,
        title,
        url,
        type
      });
      setResources([response.data, ...resources]);
      setTitle("");
      setUrl("");
      toast({ title: "Resource added" });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.error || "Failed to add resource", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Resources</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Course resources</h1>
            <p className="mt-2 text-sm text-muted-foreground">Share links, files, and videos with learners.</p>
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Add resource</CardTitle>
            <LinkIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : (
              <>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    {courses.map(c => <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Input placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="file">File</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addResource} disabled={saving || !title || !url}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add resource
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-2">
          {resources.length === 0 ? (
            <Card className="p-6 text-center text-sm text-muted-foreground">No resources yet.</Card>
          ) : (
            resources.map(r => (
              <Card key={r._id}>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground">{r.type}</p>
                  <p className="font-medium text-foreground">{r.title}</p>
                  <a href={r.url} className="text-xs text-primary hover:underline" target="_blank" rel="noreferrer">{r.url}</a>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorResources;
