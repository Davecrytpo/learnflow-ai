import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Plus, Trash2, GripVertical, FileText, 
  Video, FileStack, Sparkles, Loader2, 
  ChevronRight, Save, Layout, Youtube, Upload, Pencil
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateCurriculumOutline, generateLessonContent } from "@/lib/anthropic";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

const EditCourse = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Lesson Edit State
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const fetchCourseData = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const { data: courseData } = await supabase.from("courses").select("*").eq("id", courseId).single();
      const { data: sectionData } = await supabase
        .from("modules")
        .select("*, lessons(*)")
        .eq("course_id", courseId)
        .order("order", { ascending: true });
      
      setCourse(courseData);
      setSections(sectionData || []);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const addSection = async () => {
    const { data, error } = await supabase.from("modules").insert({
      course_id: courseId!,
      title: "New Section",
      order: sections.length
    }).select().single();
    
    if (error) toast({ title: "Error", variant: "destructive" });
    else fetchCourseData();
  };

  const addLesson = async (sectionId: string) => {
    const { data, error } = await supabase.from("lessons").insert({
      module_id: sectionId,
      course_id: courseId!,
      title: "New Lesson",
      order: 0
    }).select().single();
    
    if (error) toast({ title: "Error", variant: "destructive" });
    else {
      setEditingLesson(data);
      setIsLessonModalOpen(true);
      fetchCourseData();
    }
  };

  const deleteLesson = async (lessonId: string) => {
    const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
    if (error) toast({ title: "Error", variant: "destructive" });
    else fetchCourseData();
  };

  const deleteSection = async (sectionId: string) => {
    const { error } = await supabase.from("sections").delete().eq("id", sectionId);
    if (error) toast({ title: "Error", variant: "destructive" });
    else fetchCourseData();
  };

  const updateCourse = async () => {
    setSaving(true);
    const { error } = await supabase.from("courses").update({
      title: course.title,
      description: course.description,
      summary: course.summary
    }).eq("id", courseId);
    
    setSaving(false);
    if (error) toast({ title: "Update failed", variant: "destructive" });
    else toast({ title: "Changes saved" });
  };

  const handleGenerateOutline = async () => {
    if (!course.title) return;
    setAiLoading(true);
    try {
      const outline = await generateCurriculumOutline(course.title);
      for (const [sIdx, mod] of outline.modules.entries()) {
        const { data: section } = await supabase.from("sections").insert({
          course_id: courseId,
          title: mod.title,
          order: sections.length + sIdx
        }).select().single();

        if (section) {
          const lessonInserts = mod.lessons.map((l: any, lIdx: number) => ({
            section_id: section.id,
            course_id: courseId,
            title: l.title,
            lesson_type: l.type || "content",
            order: lIdx
          }));
          await supabase.from("lessons").insert(lessonInserts);
        }
      }
      toast({ title: "Curriculum Generated", description: "AI has structured your course modules." });
      fetchCourseData();
    } catch (err: any) {
      toast({ title: "AI Error", description: err.message, variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateLessonContent = async () => {
    if (!editingLesson) return;
    setAiLoading(true);
    try {
      const content = await generateLessonContent(course.title, editingLesson.title);
      setEditingLesson({ ...editingLesson, content });
      toast({ title: "Content Generated" });
    } catch (err: any) {
      toast({ title: "AI Error", description: err.message, variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const saveLesson = async () => {
    if (!editingLesson) return;
    const { error } = await supabase.from("lessons").update({
      title: editingLesson.title,
      content: editingLesson.content,
      lesson_type: editingLesson.lesson_type,
      video_url: editingLesson.video_url,
    }).eq("id", editingLesson.id);

    if (error) toast({ title: "Save Error", variant: "destructive" });
    else {
      toast({ title: "Lesson Saved" });
      setIsLessonModalOpen(false);
      fetchCourseData();
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-8 max-w-5xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-2 uppercase tracking-tighter">{course.status}</Badge>
            <h1 className="text-3xl font-display font-bold">Curriculum Designer</h1>
            <p className="text-muted-foreground mt-1">Structure your course with sections and diverse lesson types.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/instructor")}>Exit</Button>
            <Button onClick={updateCourse} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save All
            </Button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-lg">Core Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Course Title</Label>
                  <Input value={course.title} onChange={e => setCourse({...course, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Summary</Label>
                  <Input value={course.summary || ""} onChange={e => setCourse({...course, summary: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={course.description} onChange={e => setCourse({...course, description: e.target.value})} className="h-32" />
                </div>
                <Button 
                  onClick={handleGenerateOutline} 
                  disabled={aiLoading} 
                  variant="outline" 
                  className="w-full gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Generate AI Outline
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Curriculum Builder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Layout className="h-5 w-5 text-primary" /> Course Content
              </h2>
              <Button onClick={addSection} size="sm" variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                <Plus className="mr-2 h-4 w-4" /> Add Section
              </Button>
            </div>

            <Accordion type="multiple" className="space-y-4">
              {sections.map((section, idx) => (
                <AccordionItem key={section.id} value={section.id} className="border rounded-xl bg-card overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30 transition-all">
                    <div className="flex items-center gap-3 text-left w-full">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="font-bold flex-1 text-slate-900">Section {idx + 1}: {section.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0 space-y-4 border-t border-border/50 bg-background/30">
                    <div className="pt-4 space-y-3">
                      {section.lessons?.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((lesson: any) => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card group hover:border-primary/30 transition-all">
                          <div className="flex items-center gap-3">
                            {lesson.lesson_type === 'video' ? <Video className="h-4 w-4 text-blue-500" /> : <FileText className="h-4 w-4 text-emerald-500" />}
                            <span className="text-sm font-medium">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => { setEditingLesson(lesson); setIsLessonModalOpen(true); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteLesson(lesson.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Button onClick={() => addLesson(section.id)} variant="ghost" className="flex-1 h-10 border-2 border-dashed text-muted-foreground hover:text-primary hover:border-primary/50 text-xs">
                          <Plus className="mr-2 h-3 w-3" /> New Lesson
                        </Button>
                        <Button onClick={() => deleteSection(section.id)} variant="ghost" size="icon" className="h-10 w-10 text-destructive hover:bg-destructive/5">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Lesson Editor Modal */}
        <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Edit Lesson</DialogTitle>
                <Button onClick={handleGenerateLessonContent} disabled={aiLoading} variant="outline" size="sm" className="gap-2 text-indigo-600">
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Generate Content
                </Button>
              </div>
            </DialogHeader>
            {editingLesson && (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Lesson Title</Label>
                    <Input value={editingLesson.title} onChange={e => setEditingLesson({...editingLesson, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Lesson Type</Label>
                    <Select value={editingLesson.lesson_type} onValueChange={v => setEditingLesson({...editingLesson, lesson_type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="content">Text Content</SelectItem>
                        <SelectItem value="video">Video (Upload/URL)</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {editingLesson.lesson_type === 'video' && (
                  <div className="space-y-4 p-4 border rounded-xl bg-slate-50">
                    <Label className="font-bold flex items-center gap-2"><Video className="h-4 w-4" /> Video Source</Label>
                    <div className="grid gap-4">
                       <div className="space-y-2">
                         <Label className="text-xs">YouTube or Vimeo URL</Label>
                         <div className="flex gap-2">
                           <Youtube className="h-10 w-10 p-2 bg-white rounded border text-red-600" />
                           <Input placeholder="https://youtube.com/watch?v=..." value={editingLesson.video_url || ""} onChange={e => setEditingLesson({...editingLesson, video_url: e.target.value})} />
                         </div>
                       </div>
                       <div className="text-center py-4 border-2 border-dashed rounded-xl bg-white">
                         <Upload className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                         <p className="text-xs text-slate-500">Upload direct video file (MP4, WebM)</p>
                         <Button variant="link" size="sm" className="mt-1">Browse Files</Button>
                       </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Lesson Content</Label>
                  <div className="min-h-[400px] border rounded-xl overflow-hidden">
                    <RichTextEditor content={editingLesson.content || ""} onChange={html => setEditingLesson({...editingLesson, content: html})} />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsLessonModalOpen(false)}>Cancel</Button>
                  <Button onClick={saveLesson}>Save Lesson Changes</Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default EditCourse;
