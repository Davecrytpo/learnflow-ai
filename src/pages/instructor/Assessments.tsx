import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ClipboardSignature, Search, Loader2, FileCheck2, HelpCircle, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

const InstructorAssessments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [assignments, setAssignments] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [assignmentData, quizData] = await Promise.all([
          apiClient.fetch("/instructor/assignments"),
          apiClient.fetch("/instructor/quizzes")
        ]);
        setAssignments(assignmentData || []);
        setQuizzes(quizData || []);
      } catch (error: any) {
        toast({ title: "Assessment load failed", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const assessments = useMemo(() => {
    const records = [
      ...assignments.map((item) => ({
        id: item.id || item._id,
        title: item.title,
        type: "Assignment",
        courseTitle: item.courses?.title || "Untitled Course",
        status: item.due_date ? (new Date(item.due_date) >= new Date() ? "Scheduled" : "Past due") : "Open",
        targetHref: `/instructor/courses/${item.course_id}`
      })),
      ...quizzes.map((item) => ({
        id: item.id || item._id,
        title: item.title,
        type: item.quiz_type === "test" ? "Test" : "Quiz",
        courseTitle: item.courses?.title || "Untitled Course",
        status: item.published ? "Published" : "Draft",
        targetHref: `/instructor/courses/${item.course_id}`
      }))
    ];

    return records.filter((record) => {
      const needle = search.toLowerCase();
      return record.title.toLowerCase().includes(needle) || record.courseTitle.toLowerCase().includes(needle) || record.type.toLowerCase().includes(needle);
    });
  }, [assignments, quizzes, search]);

  const liveCount = assessments.filter((item) => item.status === "Published" || item.status === "Scheduled" || item.status === "Open").length;

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-8 pb-24">
        <section className="rounded-[2.5rem] border border-slate-800 bg-slate-950 p-8 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Assessments</p>
              <h1 className="mt-2 font-display text-3xl font-bold">Evaluation hub</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                View and manage every quiz, test, and assignment tied to your courses.
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => navigate("/instructor/quizzes")}>
                <HelpCircle className="mr-2 h-4 w-4" /> Manage quizzes
              </Button>
              <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={() => navigate("/instructor/assignments")}>
                <FileCheck2 className="mr-2 h-4 w-4" /> Manage assignments
              </Button>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">All assessments</CardTitle>
              <ClipboardSignature className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{assignments.length + quizzes.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Live or open</CardTitle>
              <Badge variant="secondary">{liveCount}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{liveCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Courses covered</CardTitle>
              <Badge variant="secondary">{new Set(assessments.map((item) => item.courseTitle)).size}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{new Set(assessments.map((item) => item.courseTitle)).size}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Assessment library</CardTitle>
            <CardDescription>Real records from your course catalog.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assessments" className="pl-9" />
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : assessments.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                No assessments found for the current search.
              </div>
            ) : (
              <div className="space-y-3">
                {assessments.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex flex-col gap-4 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.type} in {item.courseTitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{item.status}</Badge>
                      <Button size="sm" variant="outline" onClick={() => navigate(item.targetHref)}>
                        Open course <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InstructorAssessments;
