import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InstructorAnnouncements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, title")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });
      setCourses(data || []);
      if (data && data.length > 0) setSelectedCourse(data[0].id);
      setLoading(false);
    };
    fetch();
  }, [user]);

  useEffect(() => {
    if (!selectedCourse) return;
    const fetch = async () => {
      const { data } = await (supabase
        .from as any)("course_announcements")
        .select("*")
        .eq("course_id", selectedCourse)
        .order("created_at", { ascending: false });
      setAnnouncements(data || []);
    };
    fetch();
  }, [selectedCourse]);

  const createAnnouncement = async () => {
    if (!user || !selectedCourse || !title || !body) return;
    setSaving(true);
    const { data, error } = await (supabase
      .from as any)("course_announcements")
      .insert({ course_id: selectedCourse, author_id: user.id, title, body })
      .select()
      .single();
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setAnnouncements([data, ...announcements]);
    setTitle("");
    setBody("");
    toast({ title: "Announcement posted" });
  };

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Announcements</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Course announcements</h1>
            <p className="mt-2 text-sm text-muted-foreground">Post updates to keep students informed.</p>
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">New announcement</CardTitle>
            <Megaphone className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : (
              <>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input placeholder="Announcement title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Textarea placeholder="Write the announcement..." value={body} onChange={(e) => setBody(e.target.value)} rows={4} />
                <Button onClick={createAnnouncement} disabled={saving || !title || !body}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Post announcement
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          {announcements.length === 0 ? (
            <Card className="p-6 text-center text-sm text-muted-foreground">No announcements yet.</Card>
          ) : announcements.map(a => (
            <Card key={a.id}>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</p>
                <h3 className="mt-2 font-semibold text-foreground">{a.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorAnnouncements;
