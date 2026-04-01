import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Loader2, BarChart3, TrendingUp, PieChart, Users, Award } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";

const InstructorAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ averageCohort: 0, completionRate: 0, engagementIndex: 0 });

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const [data, performance] = await Promise.all([
          apiClient.fetch("/instructor/analytics/enrollments"),
          apiClient.fetch("/instructor/performance-data")
        ]);
        const enrollmentData = data || [];
        setChartData(enrollmentData);

        const totalStudents = enrollmentData.reduce((total: number, item: any) => total + (item.students || 0), 0);
        const averageCohort = enrollmentData.length > 0 ? Math.round((totalStudents / enrollmentData.length) * 10) / 10 : 0;
        const completionRate = performance.students > 0 ? Math.min(100, Math.round((performance.submissions / performance.students) * 100)) : 0;
        const engagementIndex = Math.min(100, Math.round(((performance.attendance || 0) + (performance.submissions || 0)) / Math.max(performance.students || 1, 1) * 10));

        setSummary({
          averageCohort,
          completionRate,
          engagementIndex
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-10 pb-32 max-w-6xl mx-auto">
        
        {/* Professional Header */}
        <section className="relative overflow-hidden rounded-[3rem] border border-slate-800 bg-slate-950 p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-950 to-slate-950" />
          <div className="relative z-10 flex items-center gap-8">
            <div className="h-20 w-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <BarChart3 className="h-10 w-10 text-indigo-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3 border border-indigo-500/20">
                Performance Intelligence
              </div>
              <h1 className="font-display text-4xl font-bold">Instructional Analytics</h1>
              <p className="mt-2 text-slate-400 font-medium max-w-xl">
                Deep-dive into enrollment velocity and curriculum engagement. Visualize institutional growth and cohort success metrics.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
           <Card className="border-none shadow-sm bg-white rounded-[2.5rem] p-8">
              <div className="flex items-center justify-between mb-4">
                 <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <Users className="h-6 w-6 text-indigo-600" />
                 </div>
                 <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Cohort Size</p>
              <h3 className="text-3xl font-black text-slate-900">{summary.averageCohort}</h3>
           </Card>
           <Card className="border-none shadow-sm bg-white rounded-[2.5rem] p-8">
              <div className="flex items-center justify-between mb-4">
                 <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <Award className="h-6 w-6 text-emerald-600" />
                 </div>
                 <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completion Rate</p>
              <h3 className="text-3xl font-black text-slate-900">{summary.completionRate}%</h3>
           </Card>
           <Card className="border-none shadow-sm bg-white rounded-[2.5rem] p-8">
              <div className="flex items-center justify-between mb-4">
                 <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <PieChart className="h-6 w-6 text-amber-600" />
                 </div>
                 <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Engagement Index</p>
              <h3 className="text-3xl font-black text-slate-900">{summary.engagementIndex}%</h3>
           </Card>
        </div>

        <Card className="border-none shadow-sm bg-white rounded-[3rem] overflow-hidden">
          <CardHeader className="p-10 pb-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Enrollment Distribution</CardTitle>
              <CardDescription>Comparative analysis of student enrollment across active curriculum.</CardDescription>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
               <TrendingUp className="h-5 w-5 text-slate-300" />
            </div>
          </CardHeader>
          <CardContent className="p-10 pt-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                 <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                 <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Processing Data Nodes...</p>
              </div>
            ) : chartData.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                   <BarChart3 className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                   <p className="text-slate-400 font-bold">Insufficient data for visualization.</p>
                </div>
            ) : (
              <div className="h-[400px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} 
                      axisLine={false} 
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} 
                      axisLine={false} 
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '15px' }}
                      cursor={{fill: '#f8fafc', radius: 12}}
                    />
                    <Bar dataKey="students" radius={[10, 10, 10, 10]} barSize={40}>
                       {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InstructorAnalytics;
