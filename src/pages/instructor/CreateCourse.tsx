import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Loader2, Sparkles, CheckCircle2, ChevronRight, BookOpen } from "lucide-react";
import { formatAssignmentDescription, generateCourseDraft, generateAssessment } from "@/lib/ai-service";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Technology", "Science", "Mathematics", "Business", "Arts", "Health", "Engineering", "Humanities"];
const levels = ["Undergraduate", "Graduate", "Doctoral", "Certificate", "Online"];

const CreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [syllabus, setSyllabus] = useState<any[]>([]);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    summary: "",
    category: "",
    level: "Undergraduate",
    credits: 3,
    duration: "12 Weeks",
    cover_image_url: "",
  });

  const handleAIAssist = async () => {
    if (!form.title) {
      toast({ title: "Topic required", description: "Please enter a course title or topic first.", variant: "destructive" });
      return;
    }

    setAiLoading(true);
    try {
      const draft = await generateCourseDraft(form.title);
      const imageUrl = `https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800&q=${encodeURIComponent(draft.image_search_term || form.title)}`;
      
      setForm((current) => ({
        ...current,
        title: draft.title || form.title,
        summary: draft.summary || "",
        description: draft.description || "",
        category: draft.category || "General",
        level: draft.level || "Undergraduate",
        credits: draft.credits || 3,
        duration: draft.duration || "12 Weeks",
        cover_image_url: imageUrl
      }));
      if (draft.syllabus) {
        setSyllabus(draft.syllabus);
      }
      toast({ title: "Full curriculum generated!", description: "AI has structured 6 rigorous modules and lessons." });
    } catch (error: any) {
      toast({ title: "AI Assist failed", description: error.message, variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      // 1. Create Course
      const data = await apiClient.fetch("/instructor/courses", {
        method: "POST",
        body: JSON.stringify(form),
      });
      
      const newCourseId = data.id || data._id;

      // 2. If syllabus exists, create modules, lessons, and assessments
      if (syllabus.length > 0) {
        toast({ title: "Building Curriculum", description: "Creating your modules, lessons, and assessments..." });
        for (const [mIdx, mod] of syllabus.entries()) {
          const moduleRes = await apiClient.fetch(`/instructor/courses/${newCourseId}/modules`, {
            method: "POST",
            body: JSON.stringify({
              title: mod.title,
              order: mIdx
            })
          });
          
          if (moduleRes && mod.lessons) {
            for (const [lIdx, lesson] of mod.lessons.entries()) {
              if (lesson.type === "assignment") {
                const assignmentDraft = await generateAssessment(lesson.title, "assignment");
                await apiClient.fetch("/instructor/assignments", {
                  method: "POST",
                  body: JSON.stringify({
                    course_id: newCourseId,
                    title: assignmentDraft.title || lesson.title,
                    description: formatAssignmentDescription(assignmentDraft),
                    max_score: assignmentDraft.max_score || 100
                  })
                });
                continue;
              }

              if (lesson.type === "quiz" || lesson.type === "test") {
                const quizDraft = await generateAssessment(lesson.title, lesson.type === "test" ? "test" : "quiz");
                await apiClient.fetch("/instructor/quizzes", {
                  method: "POST",
                  body: JSON.stringify({
                    course_id: newCourseId,
                    title: quizDraft.title || lesson.title,
                    description: quizDraft.description || "",
                    quiz_type: quizDraft.quiz_type || (lesson.type === "test" ? "test" : "quiz"),
                    time_limit_minutes: quizDraft.time_limit_minutes || 15,
                    passing_score: quizDraft.passing_score || 70,
                    max_attempts: quizDraft.max_attempts || 3,
                    questions: quizDraft.questions || []
                  })
                });
                continue;
              }

              await apiClient.fetch(`/instructor/modules/${moduleRes.id || moduleRes._id}/lessons`, {
                method: "POST",
                body: JSON.stringify({
                  title: lesson.title,
                  content: lesson.content || `Detailed academic content for ${lesson.title}.`,
                  video_url: lesson.video_url || "",
                  order: lIdx
                })
              });
            }
          }
        }
      }

      toast({ title: "Course successfully launched!", description: "Redirecting to your new curriculum." });
      navigate(`/instructor/courses/${newCourseId}`);
    } catch (error: any) {
      console.error("Course creation error detail:", error);
      toast({
        title: "Course Creation Failed",
        description: error.message || "Something went wrong while creating the course.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="mx-auto max-w-5xl space-y-10 pb-32">
        <header className="relative overflow-hidden rounded-[3rem] border border-slate-800 bg-slate-950 p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-950 to-slate-950" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-indigo-500/20">
                Curriculum Architect
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold">New Scholarly Course</h1>
              <p className="mt-4 max-w-xl text-lg font-medium leading-relaxed text-slate-400">
                Design a rigorous academic experience. Use AI to scaffold your entire curriculum in seconds.
              </p>
            </div>
            <div className="shrink-0 hidden lg:block">
               <div className="h-32 w-32 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-indigo-500" />
               </div>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-10">
            {/* Core Details */}
            <Card className="border-none shadow-sm shadow-slate-200 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Core Details</CardTitle>
                  <CardDescription>Foundational information for your curriculum.</CardDescription>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="gap-2 border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-2xl h-12 px-6 font-bold"
                  onClick={handleAIAssist}
                  disabled={aiLoading}
                >
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Auto-Generate Syllabus
                </Button>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-sm font-black text-slate-400 uppercase tracking-widest">Course Title / Topic</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Advanced Quantum Mechanics" 
                    value={form.title} 
                    onChange={(e) => setForm({ ...form, title: e.target.value })} 
                    required 
                    className="h-14 text-xl font-bold rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all shadow-inner"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="summary" className="text-sm font-black text-slate-400 uppercase tracking-widest">Executive Summary</Label>
                  <Input 
                    id="summary" 
                    placeholder="A precise summary for institutional indexing" 
                    value={form.summary} 
                    onChange={(e) => setForm({ ...form, summary: e.target.value })} 
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-black text-slate-400 uppercase tracking-widest">Syllabus Narrative</Label>
                  <div className="min-h-[300px] border rounded-2xl overflow-hidden bg-white">
                    <RichTextEditor 
                      content={form.description} 
                      onChange={(html) => setForm({ ...form, description: html })} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Syllabus Preview */}
            <AnimatePresence>
              {syllabus.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Card className="border-none shadow-sm shadow-slate-200 rounded-[2.5rem] overflow-hidden bg-indigo-50/30">
                    <CardHeader className="p-8">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        Curriculum Structure Preview
                      </CardTitle>
                      <CardDescription>AI has proposed the following structure which will be created automatically.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-4">
                      {syllabus.map((mod, mIdx) => (
                        <div key={mIdx} className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm">
                          <h3 className="font-black text-slate-900 flex items-center gap-3">
                            <span className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs">{mIdx + 1}</span>
                            {mod.title}
                          </h3>
                          <div className="mt-4 ml-11 space-y-2">
                            {mod.lessons?.map((lesson: any, lIdx: number) => (
                              <div key={lIdx} className="flex items-center justify-between gap-3 text-sm text-slate-500 font-medium bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                <span className="min-w-0 flex-1 break-words">{lesson.title}</span>
                                <span className="text-[10px] uppercase font-black text-indigo-400">{lesson.type || "content"}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4 space-y-10">
            {/* Metadata */}
            <Card className="border-none shadow-sm shadow-slate-200 rounded-[2.5rem]">
              <CardHeader className="p-8 pb-0">
                <CardTitle>Institutional Specs</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-black text-slate-400 uppercase tracking-widest">Academic Level</Label>
                  <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100"><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                      {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-black text-slate-400 uppercase tracking-widest">Subject Area</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100"><SelectValue placeholder="Select area" /></SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-black text-slate-400 uppercase tracking-widest">Credits</Label>
                    <Input 
                      type="number" 
                      min="1" 
                      max="12" 
                      value={form.credits} 
                      onChange={(e) => setForm({ ...form, credits: parseInt(e.target.value) })}
                      className="h-12 rounded-xl bg-slate-50 border-slate-100"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-black text-slate-400 uppercase tracking-widest">Duration</Label>
                    <Input 
                      placeholder="e.g. 1 Semester" 
                      value={form.duration} 
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="h-12 rounded-xl bg-slate-50 border-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="cover" className="text-sm font-black text-slate-400 uppercase tracking-widest">Visual Identity (URL)</Label>
                  <Input 
                    id="cover" 
                    placeholder="https://images.unsplash.com..." 
                    value={form.cover_image_url} 
                    onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} 
                    className="h-12 rounded-xl bg-slate-50 border-slate-100"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="sticky top-24 space-y-6">
               <Button type="submit" disabled={loading} className="w-full h-20 text-xl font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] shadow-2xl shadow-indigo-500/20 group transition-all">
                {loading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : (
                  <>
                    Initialize Curriculum
                    <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              <p className="text-[10px] text-center text-slate-400 px-8 italic leading-relaxed">
                Curriculum will be submitted for institutional accreditation upon initialization.
              </p>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateCourse;
