import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Loader2, Sparkles } from "lucide-react";
import { generateCourseDraft } from "@/lib/anthropic";

const categories = ["Technology", "Science", "Mathematics", "English/Language Arts", "Social Studies", "Business", "Arts", "Health Sciences", "Engineering", "Other"];

const CreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    summary: "",
    category: "",
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
      setForm({
        ...form,
        title: draft.title || form.title,
        summary: draft.summary || "",
        description: draft.description || "",
        category: draft.category || "",
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

    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);

    const { data, error } = await supabase.from("courses").insert({
      title: form.title, description: form.description, summary: form.summary,
      category: form.category || null, price_cents: 0, slug, author_id: user.id, published: false,
      cover_image_url: form.cover_image_url || null,
    }).select("id").single();

    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Course created!", description: "Now add modules, lessons, and assessments." });
      navigate(`/instructor/courses/${data.id}`);
    }
  };

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">New Course</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Create a new course</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Start with the essentials, then add modules, lessons, and assessments.
            </p>
          </div>
        </section>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Course Details</CardTitle>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="gap-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                onClick={handleAIAssist}
                disabled={aiLoading}
              >
                {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                AI Assist
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title or Topic *</Label>
                <Input id="title" placeholder="e.g. Introduction to Web Development" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Short Summary</Label>
                <Input id="summary" placeholder="A brief one-liner about the course" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <div className="min-h-[200px]">
                  <RichTextEditor 
                    content={form.description} 
                    onChange={(html) => setForm({ ...form, description: html })} 
                    className="min-h-[200px]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image URL</Label>
                <Input id="cover" placeholder="https://..." value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Course
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateCourse;

