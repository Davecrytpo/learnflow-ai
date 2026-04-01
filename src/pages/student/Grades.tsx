import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ClipboardCheck, Award, TrendingUp, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const StudentGrades = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [summary, setSummary] = useState({ average: 0, credits: 0, completionRate: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const [subs, quizAttempts] = await Promise.all([
          apiClient.fetch("/submissions/me"),
          apiClient.fetch("/quiz-attempts/me")
        ]);
        setSubmissions(subs || []);
        setAttempts(quizAttempts || []);

        const scoredValues = [
          ...(subs || []).map((item: any) => item.score).filter((value: number | null | undefined) => typeof value === "number"),
          ...(quizAttempts || []).map((item: any) => item.score).filter((value: number | null | undefined) => typeof value === "number")
        ];
        const average = scoredValues.length > 0
          ? Math.round((scoredValues.reduce((total: number, value: number) => total + value, 0) / scoredValues.length) * 10) / 10
          : 0;
        const completedAssignments = (subs || []).filter((item: any) => typeof item.score === "number").length;
        const completedQuizzes = (quizAttempts || []).filter((item: any) => typeof item.score === "number").length;
        const totalEvaluations = (subs || []).length + (quizAttempts || []).length;

        setSummary({
          average,
          credits: completedAssignments * 3,
          completionRate: totalEvaluations > 0 ? Math.round(((completedAssignments + completedQuizzes) / totalEvaluations) * 100) : 0
        });
      } catch (err) {
        console.error("Failed to fetch grades", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [user]);

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-12 pb-32 max-w-5xl mx-auto">
        
        {/* Scholar Header */}
        <section className="relative overflow-hidden rounded-[3rem] border border-sky-100 bg-white p-12 shadow-2xl shadow-sky-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(186,230,253,0.4),transparent)]" />
          <div className="relative z-10 flex items-center gap-8">
            <div className="h-20 w-20 rounded-3xl bg-sky-600 shadow-xl shadow-sky-200 flex items-center justify-center">
              <ClipboardCheck className="h-10 w-10 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-black uppercase tracking-[0.2em] mb-3 border border-sky-200">
                Academic Performance
              </div>
              <h1 className="font-display text-4xl font-bold text-slate-900">Your Scholastic Record</h1>
              <p className="mt-2 text-slate-500 font-medium max-w-xl">
                Comprehensive overview of your verified grades and evaluation history across the GUI curriculum.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Assignment Grades */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-slate-900 px-2 flex items-center gap-3">
              <Award className="h-6 w-6 text-sky-500" /> Assignment Evaluates
            </h2>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-[2.5rem] border border-sky-50 shadow-sm">
                <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Accessing Registry...</p>
              </div>
            ) : submissions.length === 0 ? (
              <Card className="border-none shadow-sm bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-sky-50">
                <p className="text-slate-400 font-medium italic">No assignments have been certified yet.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {submissions.map((s, i) => (
                  <motion.div 
                    key={s._id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="group hover:border-sky-200 transition-all cursor-default border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                              <CheckCircle2 className="h-6 w-6 text-sky-600" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{s.assignment_id?.title || "Academic Task"}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certified: {new Date(s.graded_at || s.submitted_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                               <span className="text-2xl font-black text-slate-900">{s.score ?? "—"}</span>
                               <span className="text-[10px] font-black text-slate-300 uppercase">/ {s.assignment_id?.max_score || 100}</span>
                            </div>
                            <Badge className={`border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg ${s.score ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-400"}`}>
                              {s.score ? "Achieved" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Quiz Results */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-slate-900 px-2 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-emerald-500" /> Quiz Outcomes
            </h2>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-[2.5rem] border border-sky-50 shadow-sm">
                <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Accessing Registry...</p>
              </div>
            ) : attempts.length === 0 ? (
              <Card className="border-none shadow-sm bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-emerald-50">
                <p className="text-slate-400 font-medium italic">No quiz outcomes recorded in the registry.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {attempts.map((a, i) => (
                  <motion.div 
                    key={a._id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="group hover:border-emerald-200 transition-all cursor-default border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                              <TrendingUp className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{a.quiz_id?.title || "Assessment Node"}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed: {new Date(a.completed_at || a.started_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-2">
                               <span className="text-2xl font-black text-slate-900">{a.score ?? "—"}</span>
                               <span className="text-[10px] font-black text-slate-300 uppercase">%</span>
                            </div>
                            <Badge className={`border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg ${(a.score || 0) >= 70 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                              {(a.score || 0) >= 70 ? "Passed" : "Retake"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Global Statistics */}
        <section className="pt-12">
           <Card className="bg-slate-950 text-white border-none shadow-2xl rounded-[3rem] overflow-hidden relative p-12">
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                 <Award className="h-48 w-48 text-white" />
              </div>
              <div className="relative z-10 grid md:grid-cols-3 gap-12 text-center md:text-left">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">Cumulative GPA Index</p>
                    <h3 className="text-6xl font-display font-bold">{summary.average ? summary.average : "N/A"}</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest pt-2 flex items-center justify-center md:justify-start gap-2">
                       <TrendingUp className="h-3 w-3 text-emerald-500" /> Based on graded assignments and quiz attempts
                    </p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">Credits Certified</p>
                    <h3 className="text-6xl font-display font-bold">{summary.credits}</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest pt-2">Calculated from completed assignment records</p>
                 </div>
                 <div className="flex flex-col justify-center items-center md:items-end">
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">Completion Rate</p>
                      <h3 className="mt-2 text-6xl font-display font-bold">{summary.completionRate}%</h3>
                      <p className="pt-2 text-xs font-bold uppercase tracking-widest text-slate-400">Coverage across all recorded evaluations</p>
                    </div>
                 </div>
              </div>
           </Card>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default StudentGrades;
