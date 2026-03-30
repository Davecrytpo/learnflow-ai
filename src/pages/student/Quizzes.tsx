import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, HelpCircle, Target, Loader2, Sparkles, ChevronRight, CheckCircle2, TrendingUp, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const StudentQuizzes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [qRes, aRes] = await Promise.all([
          apiClient.fetch("/quizzes/me"),
          apiClient.fetch("/quiz-attempts/me")
        ]);
        setQuizzes(qRes || []);
        setAttempts(aRes || []);
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const upcoming = quizzes.filter(q => !attempts.some(a => (a.quiz_id?._id || a.quiz_id) === q._id));
  const completed = attempts;
  const avgScore = attempts.length > 0 ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length) : 0;

  if (loading) return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
        <p className="text-sky-600 font-black uppercase tracking-widest text-xs">Accessing Assessment Node...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-12 pb-32 max-w-6xl mx-auto">
        
        {/* Scholar Header */}
        <section className="relative overflow-hidden rounded-[3rem] border border-sky-100 bg-white p-12 shadow-2xl shadow-sky-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(186,230,253,0.4),transparent)]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="h-20 w-20 rounded-3xl bg-sky-600 shadow-xl shadow-sky-200 flex items-center justify-center">
                <HelpCircle className="h-10 w-10 text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-black uppercase tracking-[0.2em] mb-3 border border-sky-200">
                  Academic Evaluates
                </div>
                <h1 className="font-display text-4xl font-bold text-slate-900">Quiz Center</h1>
                <p className="mt-2 text-slate-500 font-medium max-w-xl">
                  Measure your curriculum mastery. Institutional assessments provide real-time feedback on your academic trajectory.
                </p>
              </div>
            </div>
            <Button 
              className="bg-sky-600 hover:bg-sky-700 text-white font-black h-16 px-10 rounded-2xl shadow-xl shadow-sky-200 transition-all hover:scale-105 active:scale-95 text-lg"
              onClick={() => {
                const firstQuiz = upcoming[0];
                const courseId = firstQuiz?.course_id?._id || firstQuiz?.course_id?.id || firstQuiz?.course_id;
                if (courseId) navigate(`/course/${courseId}/learn`);
              }}
              disabled={upcoming.length === 0}
            >
              <Sparkles className="mr-3 h-6 w-6" /> Start Priority Quiz
            </Button>
          </div>
        </section>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            { label: "Upcoming Evaluates", count: upcoming.length, color: "bg-amber-50 text-amber-700", icon: Clock },
            { label: "Nodes Certified", count: completed.length, color: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
            { label: "Mastery Index", count: `${avgScore}%`, color: "bg-sky-50 text-sky-700", icon: TrendingUp }
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm bg-white rounded-[2.5rem] p-8">
               <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 rounded-2xl ${stat.color.split(' ')[0]} flex items-center justify-center`}>
                     <stat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900">{stat.count}</h3>
               </div>
               <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="upcoming" className="space-y-8">
          <div className="px-2">
            <TabsList className="bg-slate-100 p-1.5 rounded-[1.5rem] h-auto">
              <TabsTrigger value="upcoming" className="rounded-xl px-8 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Pending Logic Nodes</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-xl px-8 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Certified Results</TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent value="upcoming" className="mt-0 outline-none space-y-6">
              {upcoming.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-sky-50 shadow-inner">
                  <BookOpen className="h-16 w-16 text-sky-100 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold">No assessments are currently pending in your registry.</p>
                </div>
              ) : upcoming.map((item, i) => (
                <motion.div key={item._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="group hover:border-sky-300 transition-all cursor-default border-none shadow-sm hover:shadow-xl hover:shadow-sky-500/5 bg-white rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 shadow-inner border border-sky-100 group-hover:rotate-6 transition-transform">
                          <HelpCircle className="h-8 w-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">{item.course_id?.title}</span>
                          </div>
                          <h3 className="font-bold text-2xl text-slate-900 group-hover:text-sky-600 transition-colors leading-tight line-clamp-1">{item.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                             <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {item.time_limit_minutes} Min Limit</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        className="h-14 px-10 rounded-2xl font-black bg-slate-950 hover:bg-sky-600 text-white transition-all shadow-lg group/btn"
                        onClick={() => navigate(`/course/${item.course_id?._id || item.course_id?.id || item.course_id}/learn`)}
                      >
                        Execute Evaluate
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="mt-0 outline-none space-y-6">
              {completed.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-emerald-50 shadow-inner">
                  <Target className="h-16 w-16 text-emerald-100 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold">No certified assessment outcomes recorded.</p>
                </div>
              ) : completed.map((item, i) => (
                <motion.div key={item._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="group hover:border-emerald-300 transition-all cursor-default border-none shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 bg-white rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner border border-emerald-100 group-hover:rotate-6 transition-transform">
                          <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Certified Node</span>
                          </div>
                          <p className="font-bold text-2xl text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight line-clamp-1">{item.quiz_id?.title}</p>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">Verified on {new Date(item.completed_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                           <div className="flex items-center justify-end gap-2">
                              <span className="text-3xl font-black text-slate-900">{item.score}</span>
                              <span className="text-xs text-slate-300 font-black uppercase">/ {item.total_points}</span>
                           </div>
                           <Badge className={`border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg ${item.passed ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                              {item.passed ? "Logic Certified" : "Retake Suggested"}
                           </Badge>
                        </div>
                        <Button 
                          variant="ghost"
                          className="h-14 px-8 rounded-2xl font-black text-sky-600 hover:bg-sky-50 transition-all group/btn"
                          onClick={() => navigate(`/course/${item.quiz_id?.course_id?._id || item.quiz_id?.course_id?.id || item.quiz_id?.course_id}/learn`)}
                        >
                          Review Node
                          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentQuizzes;
