import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Gradebook = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  
  const [courseTitle, setCourseTitle] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!courseId || !user) return;
    fetchGradebookData();
  }, [courseId, user]);

  const fetchGradebookData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/courses/${courseId}/gradebook`);
      const { enrollments, assignments, submissions } = response.data;
      
      setStudents(enrollments);
      setAssignments(assignments);
      setSubmissions(submissions);
      
      if (enrollments.length > 0 && enrollments[0].course_id) {
        setCourseTitle(enrollments[0].course_id.title);
      } else {
        const cRes = await api.get(`/courses/${courseId}`);
        setCourseTitle(cRes.data.title);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStudentGrade = (studentId: string, itemId: string) => {
    const sub = submissions.find(s => s.student_id === studentId && s.assignment_id === itemId);
    return sub ? (sub.score !== undefined ? sub.score : "Ungraded") : "-";
  };

  const filteredStudents = students.filter(s => 
    s.student_id?.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportGrades = () => {
    // Basic CSV export logic
    const headers = ["Student", ...assignments.map(a => a.title)];
    const rows = filteredStudents.map(s => {
      return [
        s.student_id?.display_name || "Unknown",
        ...assignments.map(a => getStudentGrade(s.student_id?._id, a._id))
      ];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${courseTitle}_grades.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2 gap-1 text-muted-foreground">
                <Link to="/instructor/dashboard">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Link>
              </Button>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Gradebook</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">{courseTitle}</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Review performance by assignment and quiz, and export results anytime.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportGrades} className="gap-2">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>
          </div>
        </section>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-border overflow-x-auto bg-card/80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] sticky left-0 bg-card z-10">Student</TableHead>
                    {assignments.map(a => (
                      <TableHead key={a._id} className="text-center min-w-[120px]">
                        <div className="text-xs font-medium">{a.title}</div>
                        <div className="text-[10px] text-muted-foreground">Max: {a.max_score}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={1 + assignments.length} className="h-24 text-center">
                        No students found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map(s => (
                      <TableRow key={s.student_id?._id}>
                        <TableCell className="font-medium sticky left-0 bg-card z-10 border-r">
                          {s.student_id?.display_name || "Unknown Scholar"}
                        </TableCell>
                        {assignments.map(a => {
                          const grade = getStudentGrade(s.student_id?._id, a._id);
                          return (
                            <TableCell key={a._id} className="text-center">
                              {/* grade logic */}
                              {typeof grade === 'number' ? (
                                <Badge variant="secondary">{grade}</Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">{grade}</span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Gradebook;
