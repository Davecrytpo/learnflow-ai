import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Loader2, Sparkles } from "lucide-react";
import { generateCourseDraft } from "@/lib/anthropic";

const categories = ["Technology", "Science", "Mathematics", "Business", "Arts", "Health", "Engineering", "Humanities"];
const levels = ["Undergraduate", "Graduate", "Doctoral", "Certificate", "Online"];

const CreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [courseCount, setCourseCount] = useState(0);
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

  useEffect(() => {
    if (!user) return;
    const checkLimit = async () => {
      try {
        const response = await api.get("/instructor/courses");
        setCourseCount(response.data.length);
      } catch (err) {
        console.error("Limit check error:", err);
      }
    };
    checkLimit();
  }, [user]);

  const handleAIAssist = async () => {
    if (courseCount >= 10) {
      toast({ title: "Course Limit Reached", description: "Standard institutional accounts are limited to 10 active drafts.", variant: "destructive" });
      return;
    }
    if (!form.title) {
      toast({ title: "Topic required", description: "Please enter a course title or topic first.", variant: "destructive" });
      return;
    }

    setAiLoading(true);
    try {
      const draft = await generateCourseDraft(form.title);
      setForm({
        ...form,
        title: draft.title || form.title,
        summary: draft.summary || "",
        description: draft.description || "",
        category: draft.category || "General",
        level: draft.level || "Undergraduate",
        credits: draft.credits || 3,
        duration: draft.duration || "12 Weeks",
      });
      toast({ title: "Draft generated!", description: "AI has populated the course details for you." });
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

    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).substring(2, 7);

    try {
      const response = await api.post("/courses", {
        title: form.title, 
        description: form.description, 
        summary: form.summary,
        category: form.category || null, 
        level: form.level,
        credits: form.credits,
        duration: form.duration,
        price_cents: 0, 
        slug, 
        published: false,
        status: 'pending',
        cover_image_url: form.cover_image_url || null,
      });

      toast({ title: "Course created!", description: "Now add modules, lessons, and assessments." });
      navigate(`/instructor/courses/${response.data._id}`);
    } catch (error: any) {
      const message = error.response?.data?.error || "Course creation failed.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="mx-auto max-w-4xl space-y-8 pb-20">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-slate-900 p-10 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent)]" />
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-3">Academic Excellence</p>
            <h1 className="font-display text-4xl font-bold">Launch New Curriculum</h1>
            <p className="mt-4 text-slate-400 max-w-xl text-lg">
              Define the foundations of your course. High-quality metadata helps students and administrators discover and approve your work.
            </p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm shadow-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Core Content</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                  onClick={handleAIAssist}
                  disabled={aiLoading}
                >
                  {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  Generate with AI
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-bold">Course Title *</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. CS 101: Introduction to Web Development" 
                    value={form.title} 
                    onChange={(e) => setForm({ ...form, title: e.target.value })} 
                    required 
                    className="h-12 text-lg font-medium"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="summary" className="font-bold">Summary Description</Label>
                  <Input 
                    id="summary" 
                    placeholder="A brief overview for the course catalog (max 150 chars)" 
                    value={form.summary} 
                    onChange={(e) => setForm({ ...form, summary: e.target.value })} 
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-bold">Detailed Syllabus</Label>
                  <div className="min-h-[300px] border rounded-xl overflow-hidden">
                    <RichTextEditor 
                      content={form.description} 
                      onChange={(html) => setForm({ ...form, description: html })} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm shadow-slate-200">
              <CardHeader>
                <CardTitle>Course Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-bold">Academic Level</Label>
                  <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                      {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Subject Area</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold">Credits</Label>
                    <Input 
                      type="number" 
                      min="1" 
                      max="12" 
                      value={form.credits} 
                      onChange={(e) => setForm({ ...form, credits: parseInt(e.target.value) })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Duration</Label>
                    <Input 
                      placeholder="e.g. 12 Weeks" 
                      value={form.duration} 
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover" className="font-bold">Cover Image URL</Label>
                  <Input 
                    id="cover" 
                    placeholder="https://images.unsplash.com..." 
                    value={form.cover_image_url} 
                    onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} 
                    className="h-11"
                  />
                  <p className="text-[10px] text-muted-foreground italic">Preferred size: 1200x630px</p>
                </div>
              </CardContent>
            </Card>

            <div className="sticky top-24 space-y-4">
               <Button type="submit" disabled={loading} className="w-full h-14 text-lg font-bold bg-gradient-brand shadow-lg shadow-primary/20 hover:opacity-90">
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Save & Continue"}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground px-4 italic">
                By submitting, you agree to the Faculty Standards & Curriculum Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateCourse;

