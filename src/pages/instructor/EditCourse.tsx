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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Loader2, PlusCircle, Trash2, GripVertical, ClipboardCheck, Edit3 } from "lucide-react";

const EditCourse = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lesson Content Editing State
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [lessonContent, setLessonContent] = useState("");
  const [savingContent, setSavingContent] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    const fetch = async () => {
      const [courseRes, modRes, lessonRes, quizRes, assignRes, resRes] = await Promise.all([
        supabase.from("courses").select("*").eq("id", courseId).single(),
        supabase.from("modules").select("*").eq("course_id", courseId).order("order"),
        supabase.from("lessons").select("*").eq("course_id", courseId).order("order"),
        supabase.from("quizzes").select("*").eq("course_id", courseId).order("order"),
        supabase.from("assignments").select("*").eq("course_id", courseId).order("created_at"),
        supabase.from("course_resources").select("*").eq("course_id", courseId).order("created_at"),
      ]);
      setCourse(courseRes.data);
      setModules(modRes.data || []);
      setLessons(lessonRes.data || []);
      setQuizzes(quizRes.data || []);
      setAssignments(assignRes.data || []);
      setResources(resRes.data || []);

      // Load questions for all quizzes
      if (quizRes.data && quizRes.data.length > 0) {
        const qIds = quizRes.data.map((q: any) => q.id);
        const { data: questionsData } = await supabase.from("quiz_questions").select("*").in("quiz_id", qIds).order("order");
        setQuizQuestions(questionsData || []);
      }
      setLoading(false);
    };
    fetch();
  }, [courseId]);

  const saveCourse = async () => {
    if (!course) return;
    setSaving(true);
    const { error } = await supabase.from("courses").update({
      title: course.title, description: course.description, summary: course.summary,
      category: course.category, published: course.published,
    }).eq("id", course.id);
    setSaving(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Saved!" });
  };

  const addModule = async () => {
    if (!courseId) return;
    const { data, error } = await supabase.from("modules").insert({
      course_id: courseId, title: "New Module", order: modules.length,
    }).select().single();
    if (data) setModules([...modules, data]);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  const addLesson = async (moduleId: string) => {
    if (!courseId) return;
    const moduleLessons = lessons.filter((l) => l.module_id === moduleId);
    const { data, error } = await supabase.from("lessons").insert({
      course_id: courseId, module_id: moduleId, title: "New Lesson", order: moduleLessons.length,
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

  const openLessonEditor = (lesson: any) => {
    setEditingLesson(lesson);
    setLessonContent(lesson.content || "");
  };

  const saveLessonContent = async () => {
    if (!editingLesson) return;
    setSavingContent(true);
    const { error } = await supabase
      .from("lessons")
      .update({ content: lessonContent, updated_at: new Date().toISOString() })
      .eq("id", editingLesson.id);
    
    setSavingContent(false);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Content saved!" });
      setLessons(lessons.map(l => l.id === editingLesson.id ? { ...l, content: lessonContent } : l));
      setEditingLesson(null);
    }
  };

  // Quiz management
  const addQuiz = async (type: string, moduleId?: string) => {
    if (!courseId) return;
    const { data, error } = await supabase.from("quizzes").insert({
      course_id: courseId,
      module_id: moduleId || null,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      quiz_type: type,
      order: quizzes.length,
    }).select().single();
    if (data) setQuizzes([...quizzes, data]);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  const updateQuiz = async (id: string, updates: Record<string, any>) => {
    await supabase.from("quizzes").update(updates).eq("id", id);
    setQuizzes(quizzes.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuiz = async (id: string) => {
    await supabase.from("quizzes").delete().eq("id", id);
    setQuizzes(quizzes.filter(q => q.id !== id));
    setQuizQuestions(quizQuestions.filter(qq => qq.quiz_id !== id));
  };

  const addAssignment = async (moduleId?: string) => {
    if (!courseId) return;
    const { data, error } = await supabase.from("assignments").insert({
      course_id: courseId,
      module_id: moduleId || null,
      title: "New Assignment",
      max_score: 100,
    }).select().single();
    if (data) setAssignments([...assignments, data]);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  const updateAssignment = async (id: string, updates: Record<string, any>) => {
    await supabase.from("assignments").update(updates).eq("id", id);
    setAssignments(assignments.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAssignment = async (id: string) => {
    await supabase.from("assignments").delete().eq("id", id);
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const addResource = async (moduleId?: string) => {
    if (!courseId) return;
    const { data, error } = await supabase.from("course_resources").insert({
      course_id: courseId,
      module_id: moduleId || null,
      title: "New Resource Link",
      url: "https://",
      type: "link",
    }).select().single();
    if (data) setResources([...resources, data]);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  const updateResource = async (id: string, updates: Record<string, any>) => {
    await supabase.from("course_resources").update(updates).eq("id", id);
    setResources(resources.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteResource = async (id: string) => {
    await supabase.from("course_resources").delete().eq("id", id);
    setResources(resources.filter(r => r.id !== id));
  };

  const addQuestion = async (quizId: string) => {
    const { data, error } = await supabase.from("quiz_questions").insert({
      quiz_id: quizId,
      question_text: "New Question",
      question_type: "multiple_choice",
      options: JSON.stringify(["Option A", "Option B", "Option C", "Option D"]),
      correct_answer: "Option A",
      order: quizQuestions.filter(q => q.quiz_id === quizId).length,
    }).select().single();
    if (data) setQuizQuestions([...quizQuestions, data]);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  const updateQuestion = async (id: string, updates: Record<string, any>) => {
    await supabase.from("quiz_questions").update(updates).eq("id", id);
    setQuizQuestions(quizQuestions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = async (id: string) => {
    await supabase.from("quiz_questions").delete().eq("id", id);
    setQuizQuestions(quizQuestions.filter(q => q.id !== id));
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
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Course Editor</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Edit course</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Update details, build curriculum, and manage assessments with one workspace.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setCourse({ ...course, published: !course.published }); }}>
                {course.published ? "Unpublish" : "Publish"}
              </Button>
              <Button onClick={saveCourse} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
              </Button>
            </div>
          </div>
        </section>

        <Tabs defaultValue="details">
          <TabsList className="bg-card/80">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
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
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={course.category || ""} onChange={(e) => setCourse({ ...course, category: e.target.value })} />
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
                    <Input value={mod.title} onChange={(e) => updateModule(mod.id, e.target.value)}
                      className="flex-1 border-none text-base font-semibold shadow-none focus-visible:ring-0" />
                    <Button variant="ghost" size="icon" onClick={() => deleteModule(mod.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {/* Module Activities */}
                    <div className="space-y-2">
                      {lessons.filter((l) => l.module_id === mod.id).map((lesson) => (
                        <div key={lesson.id} className="flex items-center gap-2 rounded-md border border-border p-3">
                          <GripVertical className="h-3 w-3 text-muted-foreground" />
                          <Input value={lesson.title} onChange={(e) => updateLesson(lesson.id, { title: e.target.value })}
                            className="flex-1 border-none text-sm shadow-none focus-visible:ring-0" />
                          <Button variant="ghost" size="sm" onClick={() => openLessonEditor(lesson)} title="Edit Content">
                            <Edit3 className="h-3 w-3 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteLesson(lesson.id)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                      
                      {quizzes.filter((q) => q.module_id === mod.id).map((quiz) => (
                        <div key={quiz.id} className="flex items-center gap-2 rounded-md border border-accent/20 bg-accent/5 p-3">
                          <ClipboardCheck className="h-3 w-3 text-accent" />
                          <Input value={quiz.title} onChange={(e) => updateQuiz(quiz.id, { title: e.target.value })}
                            className="flex-1 border-none text-sm shadow-none focus-visible:ring-0 bg-transparent" />
                          <Badge variant="outline" className="text-[10px]">{quiz.quiz_type}</Badge>
                          <Button variant="ghost" size="icon" onClick={() => deleteQuiz(quiz.id)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}

                      {assignments.filter((a) => a.module_id === mod.id).map((assignment) => (
                        <div key={assignment.id} className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 p-3">
                          <FileText className="h-3 w-3 text-primary" />
                          <Input value={assignment.title} onChange={(e) => updateAssignment(assignment.id, { title: e.target.value })}
                            className="flex-1 border-none text-sm shadow-none focus-visible:ring-0 bg-transparent" />
                          <Badge variant="outline" className="text-[10px]">Assignment</Badge>
                          <Button variant="ghost" size="icon" onClick={() => deleteAssignment(assignment.id)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}

                      {resources.filter((r) => r.module_id === mod.id).map((resource) => (
                        <div key={resource.id} className="flex items-center gap-2 rounded-md border border-border p-3">
                          <LinkIcon className="h-3 w-3 text-muted-foreground" />
                          <Input value={resource.title} onChange={(e) => updateResource(resource.id, { title: e.target.value })}
                            className="flex-1 border-none text-sm shadow-none focus-visible:ring-0" />
                          <Input value={resource.url} onChange={(e) => updateResource(resource.id, { url: e.target.value })}
                            className="w-1/3 border-none text-xs shadow-none focus-visible:ring-0 text-muted-foreground" />
                          <Button variant="ghost" size="icon" onClick={() => deleteResource(resource.id)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t border-border/50">
                      <Button variant="ghost" size="sm" onClick={() => addLesson(mod.id)} className="h-7 text-[10px]">
                        <PlusCircle className="mr-1 h-3 w-3" /> Add Lesson
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => addQuiz('quiz', mod.id)} className="h-7 text-[10px]">
                        <ClipboardList className="mr-1 h-3 w-3" /> Add Quiz
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => addAssignment(mod.id)} className="h-7 text-[10px]">
                        <FileText className="mr-1 h-3 w-3" /> Add Assignment
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => addResource(mod.id)} className="h-7 text-[10px]">
                        <LinkIcon className="mr-1 h-3 w-3" /> Add Resource
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" onClick={addModule}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Module
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="assessments">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {["exercise", "quiz", "test", "exam"].map(type => (
                  <Button key={type} variant="outline" size="sm" onClick={() => addQuiz(type)}>
                    <PlusCircle className="mr-1 h-3 w-3" /> Add {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>

              {quizzes.length === 0 ? (
                <Card className="p-8 text-center">
                  <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground/40" />
                  <p className="mt-4 text-muted-foreground">No assessments yet. Add exercises, quizzes, tests, or exams above.</p>
                </Card>
              ) : (
                quizzes.map(quiz => (
                  <Card key={quiz.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            quiz.quiz_type === "exam" ? "bg-destructive/10 text-destructive" :
                            quiz.quiz_type === "test" ? "bg-primary/10 text-primary" :
                            quiz.quiz_type === "quiz" ? "bg-accent/10 text-accent" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {quiz.quiz_type.toUpperCase()}
                          </span>
                          <Input value={quiz.title} onChange={e => updateQuiz(quiz.id, { title: e.target.value })}
                            className="border-none text-base font-semibold shadow-none focus-visible:ring-0 max-w-xs" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Label className="text-xs">Pass %</Label>
                            <Input type="number" className="w-16 h-8 text-xs" value={quiz.passing_score}
                              onChange={e => updateQuiz(quiz.id, { passing_score: Number(e.target.value) })} />
                          </div>
                          <div className="flex items-center gap-1">
                            <Label className="text-xs">Time (min)</Label>
                            <Input type="number" className="w-16 h-8 text-xs" value={quiz.time_limit_minutes || ""}
                              onChange={e => updateQuiz(quiz.id, { time_limit_minutes: Number(e.target.value) || null })} />
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => updateQuiz(quiz.id, { published: !quiz.published })}>
                            {quiz.published ? "Unpublish" : "Publish"}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteQuiz(quiz.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {quizQuestions.filter(q => q.quiz_id === quiz.id).map((question, qi) => (
                        <div key={question.id} className="rounded-lg border border-border p-4 space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="mt-2 text-xs font-medium text-muted-foreground">Q{qi + 1}</span>
                            <div className="flex-1 space-y-2">
                              <Input value={question.question_text}
                                onChange={e => updateQuestion(question.id, { question_text: e.target.value })}
                                placeholder="Enter question..." />
                              <div className="flex gap-2">
                                <Select value={question.question_type}
                                  onValueChange={v => updateQuestion(question.id, { question_type: v })}>
                                  <SelectTrigger className="w-40 h-8"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                    <SelectItem value="true_false">True/False</SelectItem>
                                    <SelectItem value="short_answer">Short Answer</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input className="w-20 h-8 text-xs" type="number" value={question.points}
                                  onChange={e => updateQuestion(question.id, { points: Number(e.target.value) })}
                                  placeholder="Points" />
                              </div>
                              {question.question_type === "multiple_choice" && (
                                <div className="space-y-1">
                                  {(typeof question.options === 'string' ? JSON.parse(question.options) : (question.options || [])).map((opt: string, oi: number) => (
                                    <div key={oi} className="flex items-center gap-2">
                                      <input type="radio" name={`correct-${question.id}`} checked={question.correct_answer === opt}
                                        onChange={() => updateQuestion(question.id, { correct_answer: opt })}
                                        className="accent-primary" />
                                      <Input className="h-7 text-xs" value={opt}
                                        onChange={e => {
                                          const opts = typeof question.options === 'string' ? JSON.parse(question.options) : [...(question.options || [])];
                                          const oldOpt = opts[oi];
                                          opts[oi] = e.target.value;
                                          const updates: Record<string, any> = { options: JSON.stringify(opts) };
                                          if (question.correct_answer === oldOpt) updates.correct_answer = e.target.value;
                                          updateQuestion(question.id, updates);
                                        }} />
                                    </div>
                                  ))}
                                </div>
                              )}
                              {question.question_type === "true_false" && (
                                <Select value={question.correct_answer} onValueChange={v => updateQuestion(question.id, { correct_answer: v })}>
                                  <SelectTrigger className="w-24 h-8"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="True">True</SelectItem>
                                    <SelectItem value="False">False</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                              {question.question_type === "short_answer" && (
                                <Input className="h-8 text-xs" value={question.correct_answer} placeholder="Correct answer"
                                  onChange={e => updateQuestion(question.id, { correct_answer: e.target.value })} />
                              )}
                            </div>
                            <Button variant="ghost" size="icon" className="mt-1" onClick={() => deleteQuestion(question.id)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" onClick={() => addQuestion(quiz.id)}>
                        <PlusCircle className="mr-1 h-3 w-3" /> Add Question
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={!!editingLesson} onOpenChange={(open) => !open && setEditingLesson(null)}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Edit Lesson Content: {editingLesson?.title}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden border border-border rounded-md">
              {editingLesson && (
                <RichTextEditor 
                  content={lessonContent} 
                  onChange={setLessonContent} 
                  className="h-full border-none"
                />
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingLesson(null)}>Cancel</Button>
              <Button onClick={saveLessonContent} disabled={savingContent}>
                {savingContent && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Content
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default EditCourse;
