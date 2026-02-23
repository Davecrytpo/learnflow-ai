import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ListChecks } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const QuestionBank = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [answer, setAnswer] = useState("");
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
      const { data: quizzes } = await supabase
        .from("quizzes")
        .select("id")
        .eq("course_id", selectedCourse)
        .order("created_at", { ascending: false });
      const quizIds = (quizzes || []).map((q) => q.id);
      if (quizIds.length === 0) {
        setQuestions([]);
        return;
      }
      const { data: questions } = await supabase
        .from("quiz_questions")
        .select("*")
        .in("quiz_id", quizIds)
        .order("created_at", { ascending: false });
      setQuestions(questions || []);
    };
    fetch();
  }, [selectedCourse]);

  const createQuestion = async () => {
    if (!questionText || !answer) return;
    setSaving(true);
    const { data: quiz } = await supabase
      .from("quizzes")
      .select("id")
      .eq("course_id", selectedCourse)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!quiz) {
      toast({ title: "Create a quiz first", description: "Question bank needs at least one quiz." });
      setSaving(false);
      return;
    }

    const { data, error } = await supabase
      .from("quiz_questions")
      .insert({ quiz_id: quiz.id, question_text: questionText, question_type: questionType, correct_answer: answer })
      .select()
      .single();

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setQuestions([data, ...questions]);
    setQuestionText("");
    setAnswer("");
    toast({ title: "Question created" });
  };

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Question Bank</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Reusable questions</h1>
            <p className="mt-2 text-sm text-muted-foreground">Create and manage questions for quizzes and exams.</p>
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">New question</CardTitle>
            <ListChecks className="h-4 w-4 text-primary" />
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
                <Input placeholder="Question text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
                <Select value={questionType} onValueChange={setQuestionType}>
                  <SelectTrigger><SelectValue placeholder="Question type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Multiple choice</SelectItem>
                    <SelectItem value="true_false">True/False</SelectItem>
                    <SelectItem value="short_answer">Short answer</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Correct answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
                <Button onClick={createQuestion} disabled={saving || !questionText || !answer}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create question
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-2">
          {questions.length === 0 ? (
            <Card className="p-6 text-center text-sm text-muted-foreground">No questions yet.</Card>
          ) : (
            questions.map(q => (
              <Card key={q.id}>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground">{q.question_type}</p>
                  <p className="mt-2 text-sm text-foreground">{q.question_text}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuestionBank;
