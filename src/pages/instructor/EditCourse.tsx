import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2, GripVertical } from "lucide-react";

const EditCourse = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    const fetch = async () => {
      const [courseRes, modRes, lessonRes] = await Promise.all([
        supabase.from("courses").select("*").eq("id", courseId).single(),
        supabase.from("modules").select("*").eq("course_id", courseId).order("order"),
        supabase.from("lessons").select("*").eq("course_id", courseId).order("order"),
      ]);
      setCourse(courseRes.data);
      setModules(modRes.data || []);
      setLessons(lessonRes.data || []);
      setLoading(false);
    };
    fetch();
  }, [courseId]);

  const saveCourse = async () => {
    if (!course) return;
    setSaving(true);
    const { error } = await supabase.from("courses").update({
      title: course.title,
      description: course.description,
      summary: course.summary,
      category: course.category,
      price_cents: course.price_cents,
      published: course.published,
    }).eq("id", course.id);
    setSaving(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Saved!" });
  };

  const addModule = async () => {
    if (!courseId) return;
    const { data, error } = await supabase.from("modules").insert({
      course_id: courseId,
      title: "New Module",
      order: modules.length,
    }).select().single();
    if (data) setModules([...modules, data]);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  const addLesson = async (moduleId: string) => {
    if (!courseId) return;
    const moduleLessons = lessons.filter((l) => l.module_id === moduleId);
    const { data, error } = await supabase.from("lessons").insert({
      course_id: courseId,
      module_id: moduleId,
      title: "New Lesson",
      order: moduleLessons.length,
    }).select().single();
    if (data) setLessons([...lessons, data]);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  const updateModule = async (id: string, title: string) => {
    await supabase.from("modules").update({ title }).eq("id", id);
    setModules(modules.map((m) => (m.id === id ? { ...m, title } : m)));
  };

  const updateLesson = async (id: string, updates: Record<string, any>) => {
    await supabase.from("lessons").update(updates).eq("id", id);
    setLessons(lessons.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteModule = async (id: string) => {
    await supabase.from("modules").delete().eq("id", id);
    setModules(modules.filter((m) => m.id !== id));
    setLessons(lessons.filter((l) => l.module_id !== id));
  };

  const deleteLesson = async (id: string) => {
    await supabase.from("lessons").delete().eq("id", id);
    setLessons(lessons.filter((l) => l.id !== id));
  };

  if (loading) {
    return (
      <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
        <p className="text-muted-foreground">Course not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Edit Course</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCourse({ ...course, published: !course.published })}>
              {course.published ? "Unpublish" : "Publish"}
            </Button>
            <Button onClick={saveCourse} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Summary</Label>
                  <Input value={course.summary || ""} onChange={(e) => setCourse({ ...course, summary: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={course.description || ""} onChange={(e) => setCourse({ ...course, description: e.target.value })} rows={5} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input value={course.category || ""} onChange={(e) => setCourse({ ...course, category: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (cents)</Label>
                    <Input type="number" value={course.price_cents || 0} onChange={(e) => setCourse({ ...course, price_cents: Number(e.target.value) })} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum">
            <div className="space-y-4">
              {modules.map((mod) => (
                <Card key={mod.id}>
                  <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={mod.title}
                      onChange={(e) => updateModule(mod.id, e.target.value)}
                      className="flex-1 border-none text-base font-semibold shadow-none focus-visible:ring-0"
                    />
                    <Button variant="ghost" size="icon" onClick={() => deleteModule(mod.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {lessons
                      .filter((l) => l.module_id === mod.id)
                      .map((lesson) => (
                        <div key={lesson.id} className="flex items-center gap-2 rounded-md border border-border p-3">
                          <GripVertical className="h-3 w-3 text-muted-foreground" />
                          <Input
                            value={lesson.title}
                            onChange={(e) => updateLesson(lesson.id, { title: e.target.value })}
                            className="flex-1 border-none text-sm shadow-none focus-visible:ring-0"
                          />
                          <Button variant="ghost" size="icon" onClick={() => deleteLesson(lesson.id)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    <Button variant="ghost" size="sm" onClick={() => addLesson(mod.id)} className="mt-1">
                      <PlusCircle className="mr-1 h-3 w-3" /> Add Lesson
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" onClick={addModule}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Module
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EditCourse;
