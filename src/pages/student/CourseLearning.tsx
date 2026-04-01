import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen, ChevronLeft, ChevronRight, CheckCircle, Circle, Play, ClipboardCheck,
  Award, Loader2, ArrowLeft, Clock, MessageSquare, FileText, Send, Link as LinkIcon, Download
} from "lucide-react";
import GraduationCapIcon from "@/components/icons/GraduationCapIcon";
import DOMPurify from "dompurify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscussionBoard from "@/components/discussion/DiscussionBoard";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CourseLearning = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [activeAssignment, setActiveAssignment] = useState<any>(null);
  
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);
  
  const [submissionContent, setSubmissionContent] = useState("");
  const [submissionFileUrl, setSubmissionFileUrl] = useState("");
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isViewingCertificate, setIsViewingCertificate] = useState(false);

  useEffect(() => {
    if (!courseId || !user) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1. Enrollment Check
        const enrollment = await apiClient.fetch(`/enrollments/check/${courseId}`);
        if (!enrollment || !["active", "approved", "completed"].includes(enrollment.status)) {
          toast({ title: "Access Denied", description: "This academic program is not yet active for your account.", variant: "destructive" });
          navigate("/dashboard/student");
          return;
        }

        const [courseRes, modRes, lessonRes, quizRes, assignRes, progressRes, attemptsRes, subRes] = await Promise.all([
          apiClient.fetch(`/courses/${courseId}`),
          apiClient.fetch(`/courses/${courseId}/modules`),
          apiClient.fetch(`/courses/${courseId}/lessons`),
          apiClient.fetch(`/courses/${courseId}/quizzes`),
          apiClient.fetch(`/courses/${courseId}/assignments`),
          apiClient.fetch(`/lesson-progress/${courseId}`),
          apiClient.fetch(`/quiz-attempts/me`),
          apiClient.fetch(`/submissions/me`),
        ]);

        setCourse(courseRes);
        setModules(modRes || []);
        setLessons(lessonRes || []);
        setQuizzes(quizRes || []);
        setAssignments(assignRes || []);
        setSubmissions(subRes || []);
        setCompletedLessons(new Set((progressRes || []).map((p: any) => p.lesson_id)));
        setQuizAttempts(attemptsRes || []);

        const firstIncomplete = (lessonRes || []).find((l: any) => !new Set((progressRes || []).map((p: any) => p.lesson_id)).has(l.id || l._id));
        if (firstIncomplete) setActiveLesson(firstIncomplete);
        else if (lessonRes?.[0]) setActiveLesson(lessonRes[0]);

      } catch (err: any) {
        console.error("Course learning fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [courseId, user]);

  const markLessonComplete = async (lessonId: string) => {
    if (!user || !courseId) return;
    setMarkingComplete(true);
    try {
      await apiClient.fetch("/lesson-progress", {
        method: "POST",
        body: JSON.stringify({
          lesson_id: lessonId,
          course_id: courseId,
          completed: true
        })
      });
      setCompletedLessons((prev) => new Set([...prev, lessonId]));
      
      const idx = lessons.findIndex((l) => (l.id || l._id) === lessonId);
      if (idx < lessons.length - 1) {
        setActiveLesson(lessons[idx + 1]);
      }
      toast({ title: "Module finalized." });
    } catch (err) {
      toast({ title: "Sync failed", variant: "destructive" });
    } finally {
      setMarkingComplete(false);
    }
  };

  const startQuiz = async (quiz: any) => {
    setActiveLesson(null);
    setActiveQuiz(quiz);
    setQuizResult(null);
    if (quiz.time_limit_minutes) setTimeLeft(quiz.time_limit_minutes * 60);
    setQuizAnswers({});
    try {
      const questions = await apiClient.fetch(`/quizzes/${quiz.id || quiz._id}/questions`);
      setQuizQuestions(questions || []);
    } catch (err) {
      toast({ title: "Failed to load assessment questions.", variant: "destructive" });
    }
  };

  const submitQuiz = async () => {
    if (!activeQuiz || !user) return;
    setSubmittingQuiz(true);
    try {
      let score = 0;
      let total = 0;
      quizQuestions.forEach((q) => {
        total += q.points;
        if (quizAnswers[q.id || q._id]?.trim().toLowerCase() === q.correct_answer.trim().toLowerCase()) {
          score += q.points;
        }
      });

      const passed = total > 0 ? (score / total) * 100 >= activeQuiz.passing_score : false;
      const attempt = await apiClient.fetch("/quiz-attempts", {
        method: "POST",
        body: JSON.stringify({
          quiz_id: activeQuiz.id || activeQuiz._id,
          score,
          total_points: total,
          passed,
          answers: quizAnswers
        })
      });

      setQuizAttempts((prev) => [...prev, attempt]);
      setQuizResult({ score, total, passed });
    } catch (err) {
      toast({ title: "Submission failed.", variant: "destructive" });
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const submitAssignment = async () => {
    if (!activeAssignment || !user) return;
    setSubmittingAssignment(true);
    try {
      const sub = await apiClient.fetch("/submissions", {
        method: "POST",
        body: JSON.stringify({
          assignment_id: activeAssignment.id || activeAssignment._id,
          content: submissionContent,
          file_url: submissionFileUrl || null
        })
      });
      toast({ title: "Assignment committed.", description: "Academic review pending." });
      setSubmissions((prev) => [...prev, sub]);
      setSubmissionContent("");
      setSubmissionFileUrl("");
    } catch (error: any) {
      toast({ title: "Submission error", description: error.message, variant: "destructive" });
    } finally {
      setSubmittingAssignment(false);
    }
  };

  const totalLessons = lessons.length;
  const completedCount = completedLessons.size;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const earnCertificate = async () => {
    if (!user || !courseId) return;
    try {
      await apiClient.fetch("/db/query/certificates", {
        method: "POST",
        body: JSON.stringify({
          operation: "insert",
          payload: {
            user_id: user.id,
            course_id: courseId,
            verification_code: `GUI-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          }
        })
      });
      toast({ title: "Academic Credential Earned!" });
      setIsViewingCertificate(true);
    } catch (err) {
      toast({ title: "Credential generation failed.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-[0.02]" />
      {/* Sidebar - Curriculum */}
      <aside className="relative hidden w-80 flex-shrink-0 border-r border-border bg-card/90 lg:block">
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
              const modAssignments = assignments.filter((a: any) => a.lesson_id && lessons.find(l => l.id === a.lesson_id)?.module_id === mod.id);
              const modResources = resources.filter((r: any) => r.module_id === mod.id);
              
              return (
                <div key={mod.id}>
                  <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{mod.title}</p>
                  {modLessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => { setActiveLesson(lesson); setActiveQuiz(null); setActiveAssignment(null); setQuizResult(null); }}
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
                        onClick={() => { setActiveQuiz(quiz); setActiveLesson(null); setActiveAssignment(null); setQuizResult(null); }}
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
                  {modAssignments.map((assignment) => {
                    const submitted = submissions.some((s) => s.assignment_id === assignment.id);
                    return (
                      <button
                        key={assignment.id}
                        onClick={() => { setActiveAssignment(assignment); setActiveLesson(null); setActiveQuiz(null); setQuizResult(null); }}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          activeAssignment?.id === assignment.id ? "bg-destructive/10 text-destructive" : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        {submitted ? (
                          <CheckCircle className="h-4 w-4 flex-shrink-0 text-accent" />
                        ) : (
                          <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground/40" />
                        )}
                        <span className="line-clamp-1">{assignment.title}</span>
                        <Badge variant="outline" className="ml-auto text-[10px]">Task</Badge>
                      </button>
                    );
                  })}
                  {modResources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                    >
                      <LinkIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground/40" />
                      <span className="line-clamp-1">{resource.title}</span>
                      <Badge variant="outline" className="ml-auto text-[10px]">Resource</Badge>
                    </a>
                  ))}
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

        {/* View earned certificate */}
        {isViewingCertificate && (
          <div className="border-t border-border p-4">
            <Button variant="outline" className="w-full gap-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100" onClick={() => setIsViewingCertificate(true)}>
              <Award className="h-4 w-4 text-amber-500" />
              View Certificate
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

        <main className="flex-1 overflow-auto bg-background">
          <Tabs defaultValue="lessons" className="h-full flex flex-col">
            <div className="border-b px-6 py-2 bg-card">
              <TabsList>
                <TabsTrigger value="lessons" className="gap-2"><BookOpen className="h-4 w-4" /> Lessons</TabsTrigger>
                <TabsTrigger value="discussions" className="gap-2"><MessageSquare className="h-4 w-4" /> Discussions</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="lessons" className="flex-1 overflow-auto mt-0">
              {/* Lesson view */}
              {activeLesson && !activeQuiz && !activeAssignment && (
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

              <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                <div 
                  className="rounded-xl border border-border bg-card p-6"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(activeLesson.content || "No content available for this lesson yet.") }}
                />
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
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground items-center">
                  <span>Passing: {activeQuiz.passing_score}%</span>
                  {activeQuiz.time_limit_minutes && (
                    <span className={`font-mono font-bold ${timeLeft && timeLeft < 60 ? "text-red-500 animate-pulse" : ""}`}>
                      Time Remaining: {timeLeft ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : "--:--"}
                    </span>
                  )}
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

                        {/* Assignment view */}
                        {activeAssignment && (
                          <div className="mx-auto max-w-3xl px-6 py-8">
                            <div className="mb-6">
                              <Badge variant="outline" className="mb-2 uppercase tracking-wider">Assignment</Badge>
                              <h1 className="text-2xl font-bold text-foreground">{activeAssignment.title}</h1>
                              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                {activeAssignment.due_date && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" /> Due: {new Date(activeAssignment.due_date).toLocaleDateString()}
                                  </span>
                                )}
                                <span>Max Score: {activeAssignment.max_score} pts</span>
                              </div>
                            </div>
          
                            <Card className="mb-8">
                              <CardHeader><CardTitle className="text-base font-semibold">Description</CardTitle></CardHeader>
                              <CardContent>
                                <p className="text-sm text-foreground whitespace-pre-wrap">{activeAssignment.description || "No instructions provided."}</p>
                              </CardContent>
                            </Card>
          
                            {submissions.find(s => s.assignment_id === activeAssignment.id) ? (
                              <Card className="border-accent/20 bg-accent/5">
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2 text-base text-accent">
                                    <CheckCircle className="h-5 w-5" /> Submitted
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Your Content</Label>
                                      <p className="mt-1 text-sm text-foreground">{submissions.find(s => s.assignment_id === activeAssignment.id)?.content}</p>
                                    </div>
                                    {submissions.find(s => s.assignment_id === activeAssignment.id)?.graded_at && (
                                      <div className="rounded-lg border border-border bg-card p-4">
                                        <p className="text-xs font-bold uppercase text-muted-foreground">Instructor Feedback</p>
                                        <p className="mt-2 text-sm font-medium text-foreground">Score: {submissions.find(s => s.assignment_id === activeAssignment.id)?.score} / {activeAssignment.max_score}</p>
                                        <p className="mt-1 text-sm text-muted-foreground italic">"{submissions.find(s => s.assignment_id === activeAssignment.id)?.feedback}"</p>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ) : (
                              <Card>
                                <CardHeader><CardTitle className="text-base font-semibold">Submit Your Work</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="content">Submission Text</Label>
                                    <Textarea 
                                      id="content" 
                                      placeholder="Type your response or paste links here..." 
                                      value={submissionContent}
                                      onChange={(e) => setSubmissionContent(e.target.value)}
                                      rows={6}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="file_url">Link to File (Optional)</Label>
                                    <Input 
                                      id="file_url" 
                                      placeholder="e.g. Google Drive or GitHub link" 
                                      value={submissionFileUrl}
                                      onChange={(e) => setSubmissionFileUrl(e.target.value)}
                                    />
                                  </div>
                                  <Button onClick={submitAssignment} disabled={submittingAssignment || !submissionContent.trim()} className="w-full gap-2">
                                    {submittingAssignment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    Submit Assignment
                                  </Button>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        )}
          
                        {/* Empty state */}
                        {!activeLesson && !activeQuiz && !activeAssignment && (
          
            <div className="flex h-full items-center justify-center p-8 text-center">
              <div>
                <GraduationCapIcon className="mx-auto h-12 w-12 text-muted-foreground/30" />

                <p className="mt-4 text-lg font-semibold text-foreground">No content yet</p>
                <p className="text-sm text-muted-foreground">This course doesn't have any published lessons yet.</p>
              </div>
            </div>
          )}
            </TabsContent>
            
            <TabsContent value="discussions" className="flex-1 overflow-auto p-6">
              <div className="mx-auto max-w-4xl">
                <DiscussionBoard courseId={courseId!} />
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <Dialog open={isViewingCertificate} onOpenChange={setIsViewingCertificate}>
          <DialogContent className="max-w-[95vw] md:max-w-3xl bg-white p-0 overflow-hidden border-4 md:border-8 border-double border-amber-200">
            <div className="p-6 md:p-12 text-center space-y-6 md:space-y-8 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
              <div className="space-y-2">
                <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg mb-2 md:mb-4">
                  <Award className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="font-serif text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-amber-700">Certificate of Completion</h3>
              </div>
              
              <div className="space-y-4">
                <p className="font-serif italic text-sm md:text-base text-slate-500">This is to certify that</p>
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-900 border-b-2 border-slate-200 pb-2 inline-block px-6 md:px-12">
                  {user?.user_metadata?.display_name || user?.email?.split('@')[0]}
                </h2>
                <p className="font-serif italic text-sm md:text-base text-slate-500">has successfully completed the course</p>
                <h1 className="text-xl md:text-3xl font-bold text-slate-800 uppercase tracking-tight">{course?.title}</h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 pt-6 md:pt-8">
                <div className="border-t border-slate-300 pt-2">
                  <p className="text-[10px] font-serif uppercase tracking-widest text-slate-400">Date Issued</p>
                  <p className="text-sm md:text-base font-medium text-slate-700">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <p className="text-[10px] font-serif uppercase tracking-widest text-slate-400">Verify Authenticity</p>
                  <p className="text-[10px] font-mono text-slate-400 truncate max-w-[150px] mx-auto">LF-AI-{courseId?.slice(0,8)}</p>
                </div>
              </div>

              <div className="pt-2 md:pt-4">
                <div className="flex justify-center gap-2">
                  <div className="h-1 w-1 bg-amber-400 rounded-full" />
                  <div className="h-1 w-1 bg-amber-400 rounded-full" />
                  <div className="h-1 w-1 bg-amber-400 rounded-full" />
                </div>
              </div>
            </div>
            <DialogFooter className="p-4 bg-slate-50 border-t flex flex-col sm:flex-row justify-center gap-2">
              <Button onClick={() => window.print()} variant="outline" className="gap-2 w-full sm:w-auto">
                <Download className="h-4 w-4" /> Print Certificate
              </Button>
              <Button onClick={() => setIsViewingCertificate(false)} className="w-full sm:w-auto">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CourseLearning;




