import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Flag, MessageSquare, ShieldCheck, Loader2, BookOpen, Users, TrendingUp } from "lucide-react";
import DiscussionBoard from "@/components/discussion/DiscussionBoard";
import { motion } from "framer-motion";

const InstructorDiscussions = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    openThreads: 0,
    flagged: 0,
    resolved: 14
  });

  useEffect(() => {
    if (!user) return;
    const fetchInstructorCourses = async () => {
      try {
        const data = await apiClient.fetch("/instructor/courses");
        const myCourses = data || [];
        setCourses(myCourses);
        if (myCourses.length > 0) {
          setSelectedCourseId(myCourses[0]._id || myCourses[0].id);
          
          const courseIds = myCourses.map((c: any) => c._id || c.id);
          // In a real app we'd fetch specific stats here
          setStats(prev => ({
            ...prev,
            openThreads: Math.floor(Math.random() * 20) + 5
          }));
        }
      } catch (error) {
        console.error("Error fetching instructor courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructorCourses();
  }, [user]);

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-10 pb-32 max-w-6xl mx-auto">
        
        {/* Professional Header */}
        <section className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-slate-800 bg-slate-950 p-6 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-950 to-slate-950" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="h-16 md:h-20 w-16 md:w-20 rounded-3xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                <MessageSquare className="h-10 w-10 text-amber-400" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3 border border-amber-500/20">
                  Scholarly Discourse
                </div>
                <h1 className="font-display text-2xl md:text-4xl font-bold">Dialogue Management</h1>     
                <p className="mt-2 text-slate-400 font-medium max-w-xl">
                  Moderate intellectual exchanges and guide scholastic debate. Certify high-quality contributions and maintain academic integrity.
                </p>
              </div>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black h-14 md:h-16 px-10 rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 text-lg">     
              <MessageSquare className="mr-3 h-6 w-6" /> Faculty Announcement
            </Button>          </div>
        </section>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          <Card className="border-none shadow-sm bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Threads</p>
            <h3 className="text-3xl font-black text-slate-900">{stats.openThreads}</h3>
          </Card>
          <Card className="border-none shadow-sm bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                <Flag className="h-6 w-6 text-rose-600" />
              </div>
              <span className="text-[10px] font-black text-rose-500 uppercase">Priority</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Flags for Review</p>
            <h3 className="text-3xl font-black text-slate-900">{stats.flagged}</h3>
          </Card>
          <Card className="border-none shadow-sm bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="text-[10px] font-black text-emerald-500 uppercase">Certified</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Moderation Actions</p>
            <h3 className="text-3xl font-black text-slate-900">{stats.resolved}</h3>
          </Card>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Accessing Discourse Matrix...</p>
          </div>
        ) : courses.length === 0 ? (
          <Card className="p-8 md:p-24 border-none shadow-sm bg-white rounded-[2rem] md:rounded-[3rem] text-center">
            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
               <BookOpen className="h-12 w-12 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Active Programs</h3>
            <p className="text-slate-500 font-medium">Discourse will be available once your curriculum is launched.</p>
          </Card>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[350px_1fr]">
            <div className="space-y-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 ml-4">Registry Oversight</h3>
              <div className="space-y-3">
                {courses.map((course) => (
                  <button
                    key={course._id || course.id}
                    onClick={() => setSelectedCourseId(course._id || course.id)}
                    className={`w-full text-left p-6 rounded-[2rem] border transition-all group ${
                      selectedCourseId === (course._id || course.id)
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200"
                        : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
                    }`}
                  >
                    <p className={`font-bold text-lg mb-2 line-clamp-1 ${selectedCourseId === (course._id || course.id) ? "text-white" : "text-slate-900"}`}>{course.title}</p>
                    <div className="flex items-center gap-2">
                       <Badge className={`border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg ${selectedCourseId === (course._id || course.id) ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400"}`}>
                        {selectedCourseId === (course._id || course.id) ? "Active Monitoring" : "View Registry"}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {selectedCourseId ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                   <Card className="border-none shadow-sm bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden">
                      <CardContent className="p-6 md:p-10">
                         <DiscussionBoard courseId={selectedCourseId} />
                      </CardContent>
                   </Card>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-[3.5rem] border-4 border-dashed border-slate-100 px-10 text-center">
                   <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
                      <Users className="h-10 w-10 text-slate-200" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-300">Select discourse target</h3>
                   <p className="mt-4 text-slate-400 font-medium max-w-sm">Initialize a program registry to monitor and certify student discourse.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InstructorDiscussions;


