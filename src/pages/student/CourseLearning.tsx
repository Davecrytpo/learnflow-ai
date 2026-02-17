import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen, ChevronLeft, ChevronRight, CheckCircle, Circle, Play, ClipboardCheck,
  Award, Loader2, ArrowLeft, Clock, GraduationCap
} from "lucide-react";

const CourseLearning = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);

  useEffect(() => {
    if (!courseId || !user) return;
    const fetchAll = async () => {
      const [courseRes, modRes, lessonRes, quizRes, progressRes, attemptsRes] = await Promise.all([
        supabase.from("courses").select("*").eq("id", courseId).single(),
        supabase.from("modules").select("*").eq("course_id", courseId).order("order"),
        supabase.from("lessons").select("*").eq("course_id", courseId).eq("published", true).order("order"),
        supabase.from("quizzes").select("*").eq("course_id", courseId).eq("published", true).order("order"),
        supabase.from("lesson_progress").select("lesson_id").eq("user_id", user.id).eq("course_id", courseId).eq("completed", true),
        supabase.from("quiz_attempts").select("*").eq("user_id", user.id),
      ]);

      setCourse(courseRes.data);
      setModules(modRes.data || []);
      setLessons(lessonRes.data || []);
      setQuizzes(quizRes.data || []);
      setCompletedLessons(new Set((progressRes.data || []).map((p: any) => p.lesson_id)));
      setQuizAttempts(attemptsRes.data || []);

      // Set first incomplete lesson as active
      const completed = new Set((progressRes.data || []).map((p: any) => p.lesson_id));
      const firstIncomplete = (lessonRes.data || []).find((l: any) => !completed.has(l.id));
      if (firstIncomplete) setActiveLesson(firstIncomplete);
      else if (lessonRes.data?.[0]) setActiveLesson(lessonRes.data[0]);

      setLoading(false);
    };
    fetchAll();
  }, [courseId, user]);

  const markLessonComplete = async (lessonId: string) => {
    if (!user || !courseId) return;
    setMarkingComplete(true);
    await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id: lessonId,
      course_id: courseId,
      completed: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" });

    setCompletedLessons((prev) => new Set([...prev, lessonId]));
    setMarkingComplete(false);

    // Auto advance to next lesson
    const idx = lessons.findIndex((l) => l.id === lessonId);
    if (idx < lessons.length - 1) {
      setActiveLesson(lessons[idx + 1]);
    }
    toast({ title: "Lesson completed!" });
  };

  const startQuiz = async (quiz: any) => {
    setActiveLesson(null);
    setActiveQuiz(quiz);
    setQuizResult(null);
    setQuizAnswers({});
    const { data } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quiz.id)
      .order("order");
    setQuizQuestions(data || []);
  };

  const submitQuiz = async () => {
    if (!activeQuiz || !user) return;
    setSubmittingQuiz(true);

    let score = 0;
    let total = 0;
    quizQuestions.forEach((q) => {
      total += q.points;
      if (quizAnswers[q.id]?.trim().toLowerCase() === q.correct_answer.trim().toLowerCase()) {
        score += q.points;
      }
    });

    const passed = total > 0 ? (score / total) * 100 >= activeQuiz.passing_score : false;

    const { data } = await supabase.from("quiz_attempts").insert({
      quiz_id: activeQuiz.id,
      user_id: user.id,
      score,
      total_points: total,
      passed,
      answers: quizAnswers,
      completed_at: new Date().toISOString(),
    }).select().single();

    setQuizAttempts((prev) => [...prev, data]);
    setQuizResult({ score, total, passed });
    setSubmittingQuiz(false);
  };

  const totalLessons = lessons.length;
  const completedCount = completedLessons.size;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Check certificate eligibility
  const allLessonsComplete = totalLessons > 0 && completedCount === totalLessons;
  const requiredQuizzes = quizzes.filter((q) => q.quiz_type === "exam" || q.quiz_type === "test");
  const allRequiredPassed = requiredQuizzes.every((q) =>
    quizAttempts.some((a) => a.quiz_id === q.id && a.passed)
  );
  const canGetCertificate = allLessonsComplete && (requiredQuizzes.length === 0 || allRequiredPassed);

  const earnCertificate = async () => {
    if (!user || !courseId) return;
    // Check if already has certificate
    const { data: existing } = await supabase
      .from("certificates")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (existing) {
      toast({ title: "Certificate already earned!" });
      return;
    }

    await supabase.from("certificates").insert({
      user_id: user.id,
      course_id: courseId,
    });

    // Mark enrollment as completed
    await supabase.from("enrollments").update({ completed_at: new Date().toISOString() })
      .eq("student_id", user.id)
      .eq("course_id", courseId);

    toast({ title: "🎉 Certificate earned!", description: "Congratulations on completing the course!" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — Curriculum */}
      <aside className="hidden w-80 flex-shrink-0 border-r border-border bg-card lg:block">
        <div className="p-4">
          <Button variant="ghost" size="sm" asChild className="mb-3 gap-1 text-muted-foreground">
            <Link to="/dashboard/student">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
          </Button>
          <h2 className="text-sm font-bold text-foreground line-clamp-2">{course?.title}</h2>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{completedCount}/{totalLessons} lessons</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="mt-1 h-2" />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-1 px-2 pb-4">
            {modules.map((mod) => {
              const modLessons = lessons.filter((l) => l.module_id === mod.id);
              const modQuizzes = quizzes.filter((q) => q.module_id === mod.id);
              return (
                <div key={mod.id}>
                  <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{mod.title}</p>
                  {modLessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => { setActiveLesson(lesson); setActiveQuiz(null); setQuizResult(null); }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        activeLesson?.id === lesson.id ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {completedLessons.has(lesson.id) ? (
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-accent" />
                      ) : (
                        <Circle className="h-4 w-4 flex-shrink-0 text-muted-foreground/40" />
                      )}
                      <span className="line-clamp-1">{lesson.title}</span>
                    </button>
                  ))}
                  {modQuizzes.map((quiz) => {
                    const passed = quizAttempts.some((a) => a.quiz_id === quiz.id && a.passed);
                    return (
                      <button
                        key={quiz.id}
                        onClick={() => startQuiz(quiz)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          activeQuiz?.id === quiz.id ? "bg-accent/10 text-accent" : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        {passed ? (
                          <CheckCircle className="h-4 w-4 flex-shrink-0 text-accent" />
                        ) : (
                          <ClipboardCheck className="h-4 w-4 flex-shrink-0 text-muted-foreground/40" />
                        )}
                        <span className="line-clamp-1">{quiz.title}</span>
                        <Badge variant="outline" className="ml-auto text-[10px]">{quiz.quiz_type}</Badge>
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {/* Course-level assessments */}
            {quizzes.filter((q) => !q.module_id).length > 0 && (
              <div>
                <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Course Assessments</p>
                {quizzes.filter((q) => !q.module_id).map((quiz) => {
                  const passed = quizAttempts.some((a) => a.quiz_id === quiz.id && a.passed);
                  return (
                    <button
                      key={quiz.id}
                      onClick={() => startQuiz(quiz)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        activeQuiz?.id === quiz.id ? "bg-accent/10 text-accent" : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {passed ? (
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-accent" />
                      ) : (
                        <ClipboardCheck className="h-4 w-4 flex-shrink-0 text-muted-foreground/40" />
                      )}
                      <span className="line-clamp-1">{quiz.title}</span>
                      <Badge variant={quiz.quiz_type === "exam" ? "destructive" : "outline"} className="ml-auto text-[10px]">{quiz.quiz_type}</Badge>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Certificate banner */}
        {canGetCertificate && (
          <div className="border-t border-border p-4">
            <Button className="w-full gap-2" onClick={earnCertificate}>
              <Award className="h-4 w-4" />
              Earn Certificate
            </Button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard/student"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground line-clamp-1">{course?.title}</p>
            <Progress value={progressPercent} className="mt-1 h-1.5" />
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {/* Lesson view */}
          {activeLesson && !activeQuiz && (
            <div className="mx-auto max-w-3xl px-6 py-8">
              <div className="mb-6">
                <Badge variant="secondary" className="mb-2">{modules.find((m) => m.id === activeLesson.module_id)?.title}</Badge>
                <h1 className="text-2xl font-bold text-foreground">{activeLesson.title}</h1>
                {activeLesson.duration_seconds > 0 && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {Math.round(activeLesson.duration_seconds / 60)} min
                  </p>
                )}
              </div>

              {activeLesson.video_url && (
                <div className="mb-6 aspect-video overflow-hidden rounded-xl border border-border">
                  <iframe
                    src={activeLesson.video_url}
                    className="h-full w-full"
                    allowFullScreen
                    title={activeLesson.title}
                  />
                </div>
              )}

              <div className="prose prose-sm max-w-none text-foreground">
                <div className="whitespace-pre-wrap rounded-xl border border-border bg-card p-6">
                  {activeLesson.content || "No content available for this lesson yet."}
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    const idx = lessons.findIndex((l) => l.id === activeLesson.id);
                    if (idx > 0) setActiveLesson(lessons[idx - 1]);
                  }}
                  disabled={lessons.findIndex((l) => l.id === activeLesson.id) === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>

                {!completedLessons.has(activeLesson.id) ? (
                  <Button onClick={() => markLessonComplete(activeLesson.id)} disabled={markingComplete} className="gap-2">
                    {markingComplete ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    Mark Complete
                  </Button>
                ) : (
                  <Badge variant="secondary" className="gap-1 px-3 py-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-accent" /> Completed
                  </Badge>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    const idx = lessons.findIndex((l) => l.id === activeLesson.id);
                    if (idx < lessons.length - 1) setActiveLesson(lessons[idx + 1]);
                  }}
                  disabled={lessons.findIndex((l) => l.id === activeLesson.id) === lessons.length - 1}
                  className="gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Quiz view */}
          {activeQuiz && (
            <div className="mx-auto max-w-3xl px-6 py-8">
              <div className="mb-6">
                <Badge variant={activeQuiz.quiz_type === "exam" ? "destructive" : "secondary"} className="mb-2 capitalize">
                  {activeQuiz.quiz_type}
                </Badge>
                <h1 className="text-2xl font-bold text-foreground">{activeQuiz.title}</h1>
                {activeQuiz.description && <p className="mt-1 text-muted-foreground">{activeQuiz.description}</p>}
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>Passing: {activeQuiz.passing_score}%</span>
                  {activeQuiz.time_limit_minutes && <span>Time: {activeQuiz.time_limit_minutes} min</span>}
                  {activeQuiz.max_attempts && <span>Max attempts: {activeQuiz.max_attempts}</span>}
                </div>
              </div>

              {quizResult ? (
                <Card className="text-center">
                  <CardContent className="py-10">
                    <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${quizResult.passed ? "bg-accent/10" : "bg-destructive/10"}`}>
                      {quizResult.passed ? (
                        <CheckCircle className="h-8 w-8 text-accent" />
                      ) : (
                        <ClipboardCheck className="h-8 w-8 text-destructive" />
                      )}
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-foreground">{quizResult.passed ? "Passed!" : "Not Passed"}</h2>
                    <p className="mt-1 text-muted-foreground">
                      Score: {quizResult.score}/{quizResult.total} ({quizResult.total > 0 ? Math.round((quizResult.score / quizResult.total) * 100) : 0}%)
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                      {!quizResult.passed && (
                        <Button variant="outline" onClick={() => startQuiz(activeQuiz)}>Retry</Button>
                      )}
                      <Button onClick={() => { setActiveQuiz(null); if (lessons[0]) setActiveLesson(lessons[0]); }}>
                        Back to Lessons
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : quizQuestions.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No questions added to this assessment yet.</p>
                </Card>
              ) : (
                <div className="space-y-6">
                  {quizQuestions.map((q, i) => (
                    <Card key={q.id}>
                      <CardContent className="pt-6">
                        <p className="text-sm font-semibold text-foreground">
                          {i + 1}. {q.question_text}
                          <span className="ml-2 text-xs font-normal text-muted-foreground">({q.points} pts)</span>
                        </p>

                        {q.question_type === "multiple_choice" && q.options && (
                          <div className="mt-3 space-y-2">
                            {(q.options as string[]).map((opt: string) => (
                              <button
                                key={opt}
                                onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all ${
                                  quizAnswers[q.id] === opt
                                    ? "border-primary bg-primary/5 text-foreground"
                                    : "border-border text-foreground hover:border-primary/30"
                                }`}
                              >
                                <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                  quizAnswers[q.id] === opt ? "border-primary bg-primary" : "border-border"
                                }`}>
                                  {quizAnswers[q.id] === opt && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                                </div>
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {q.question_type === "true_false" && (
                          <div className="mt-3 flex gap-3">
                            {["True", "False"].map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                                  quizAnswers[q.id] === opt
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border text-foreground hover:border-primary/30"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {q.question_type === "short_answer" && (
                          <input
                            type="text"
                            placeholder="Your answer..."
                            value={quizAnswers[q.id] || ""}
                            onChange={(e) => setQuizAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                            className="mt-3 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={submitQuiz}
                    disabled={submittingQuiz || Object.keys(quizAnswers).length < quizQuestions.length}
                  >
                    {submittingQuiz ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Submit {activeQuiz.quiz_type === "exam" ? "Examination" : "Quiz"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!activeLesson && !activeQuiz && (
            <div className="flex h-full items-center justify-center p-8 text-center">
              <div>
                <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-lg font-semibold text-foreground">No content yet</p>
                <p className="text-sm text-muted-foreground">This course doesn't have any published lessons yet.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseLearning;
