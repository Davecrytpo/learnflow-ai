import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Calendar, Check, X, Clock, AlertCircle, Users, BookOpen, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";

const Attendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await apiClient.fetch("/instructor/courses");
        setCourses(data || []);
        if (data && data.length > 0) setSelectedCourse(data[0]._id || data[0].id);
      } catch (err: any) {
        console.error("Attendance fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  useEffect(() => {
    if (!selectedCourse) return;
    const fetchSessions = async () => {
      try {
        const data = await apiClient.fetch(`/instructor/attendance/courses/${selectedCourse}/sessions`);
        setSessions(data || []);
        if (data && data.length > 0) setSelectedSession(data[0]._id || data[0].id);
        else setSelectedSession("");
      } catch (err) {
        setSessions([]);
      }
    };
    fetchSessions();
  }, [selectedCourse]);

  useEffect(() => {
    if (!selectedCourse || !selectedSession) {
      setStudents([]);
      return;
    }
    const fetchAttendance = async () => {
      try {
        const data = await apiClient.fetch(`/instructor/attendance/sessions/${selectedSession}`);
        setStudents(data.students || []);
        const map: Record<string, string> = {};
        data.records?.forEach((r: any) => map[r.student_id] = r.status);
        setAttendanceMap(map);
      } catch (err) {
        setStudents([]);
      }
    };
    fetchAttendance();
  }, [selectedSession, selectedCourse]);

  const createSession = async () => {
    if (!newDate || !selectedCourse) return;
    setCreating(true);
    try {
      const data = await apiClient.fetch(`/instructor/attendance/courses/${selectedCourse}/sessions`, {
        method: "POST",
        body: JSON.stringify({ date: newDate })
      });
      setSessions([data, ...sessions]);
      setSelectedSession(data._id || data.id);
      toast({ title: "Session created", description: `Attendance log for ${newDate} is ready.` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const markAttendance = async (studentId: string, status: string) => {
    const oldStatus = attendanceMap[studentId];
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
    try {
      await apiClient.fetch(`/instructor/attendance/sessions/${selectedSession}/records`, {
        method: "POST",
        body: JSON.stringify({
          student_id: studentId,
          status
        })
      });
    } catch (err) {
      setAttendanceMap(prev => ({ ...prev, [studentId]: oldStatus }));
      toast({ title: "Sync error", variant: "destructive" });
    }
  };

  const markAll = async (status: string) => {
    const newMap = { ...attendanceMap };
    students.forEach(s => newMap[s.student_id?._id || s.student_id] = status);
    setAttendanceMap(newMap);

    try {
      await apiClient.fetch(`/instructor/attendance/sessions/${selectedSession}/records/bulk`, {
        method: "POST",
        body: JSON.stringify({ status })
      });
      toast({ title: `Success`, description: `All scholars marked as ${status}.` });
    } catch (err) {
      toast({ title: "Sync error", variant: "destructive" });
    }
  };

  if (loading) return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Accessing Attendance Matrix...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-10 pb-32 max-w-6xl mx-auto">
        
        {/* Professional Header */}
        <section className="relative overflow-hidden rounded-[3rem] border border-slate-800 bg-slate-950 p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-950 to-slate-950" />
          <div className="relative z-10 flex items-center gap-8">
            <div className="h-20 w-20 rounded-3xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
              <Calendar className="h-10 w-10 text-emerald-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3 border border-emerald-500/20">
                Attendance Registry
              </div>
              <h1 className="font-display text-4xl font-bold">Scholar Presence Tracker</h1>
              <p className="mt-2 text-slate-400 font-medium max-w-xl">
                Monitor and certify student engagement. Maintain precise academic records for institutional compliance and performance analysis.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  Select Program
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Course</label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-slate-100 shadow-inner font-bold"><SelectValue placeholder="Select course" /></SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100">
                      {courses.map(c => <SelectItem key={c._id || c.id} value={c._id || c.id} className="rounded-xl">{c.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initialize New Session</label>
                  </div>
                  <div className="space-y-4">
                    <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-slate-100 shadow-inner font-bold" />
                    <Button onClick={createSession} disabled={creating || !newDate} className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-indigo-600 font-black transition-all shadow-lg">
                      {creating ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2 h-5 w-5" />}
                      Create Log Entry
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {sessions.length > 0 && (
              <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    Session Archive
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <Select value={selectedSession} onValueChange={setSelectedSession}>
                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-slate-100 shadow-inner font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100">
                      {sessions.map(s => <SelectItem key={s._id || s.id} value={s._id || s.id} className="rounded-xl">{s.date}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <p className="mt-4 text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">Select an entry to view/edit records</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Table */}
          <div className="lg:col-span-8 space-y-8">
            {selectedSession ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border-none shadow-sm bg-white rounded-[3rem] overflow-hidden">
                  <CardHeader className="p-10 pb-6 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Session Registry: <span className="text-indigo-600">{sessions.find(s => (s._id || s.id) === selectedSession)?.date}</span></CardTitle>
                      <CardDescription>Direct status override for all enrolled scholars.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => markAll('present')} className="rounded-xl border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold px-4 h-10">Mark All Present</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 px-4 pb-10">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-none hover:bg-transparent">
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-6">Scholar Identity</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right px-6">Direct Override</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="py-20 text-center text-slate-400 italic">No scholars currently enrolled in this program.</TableCell>
                            </TableRow>
                          ) : students.map((s, idx) => {
                            const sid = s.student_id?._id || s.student_id;
                            const status = attendanceMap[sid];
                            return (
                              <TableRow key={sid} className="group border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                                <TableCell className="py-6 px-6">
                                  <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 shadow-inner group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors">
                                      {s.student_id?.display_name?.charAt(0) || "S"}
                                    </div>
                                    <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{s.student_id?.display_name || "Unknown Scholar"}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  {status ? (
                                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] uppercase font-black tracking-widest shadow-sm ${
                                      status === 'present' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                      status === 'absent' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                      'bg-amber-100 text-amber-700 border border-amber-200'
                                    }`}>
                                      {status}
                                    </span>
                                  ) : <span className="text-slate-200 font-black">—</span>}
                                </TableCell>
                                <TableCell className="text-right px-6">
                                  <div className="flex justify-end gap-2">
                                    <Button size="icon" variant="ghost" className={`h-10 w-10 rounded-xl transition-all ${status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-300 hover:bg-emerald-50 hover:text-emerald-600'}`} onClick={() => markAttendance(sid, 'present')} title="Present">
                                      <Check className="h-5 w-5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className={`h-10 w-10 rounded-xl transition-all ${status === 'late' ? 'bg-amber-100 text-amber-700' : 'text-slate-300 hover:bg-amber-50 hover:text-amber-600'}`} onClick={() => markAttendance(sid, 'late')} title="Late">
                                      <Clock className="h-5 w-5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className={`h-10 w-10 rounded-xl transition-all ${status === 'absent' ? 'bg-rose-100 text-rose-700' : 'text-slate-300 hover:bg-rose-50 hover:text-rose-600'}`} onClick={() => markAttendance(sid, 'absent')} title="Absent">
                                      <X className="h-5 w-5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-[3.5rem] border-4 border-dashed border-slate-100 px-10 text-center">
                 <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
                    <Users className="h-10 w-10 text-slate-200" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-300">Awaiting Registry Initialization</h3>
                 <p className="mt-4 text-slate-400 font-medium max-w-sm">Select an existing session or create a new entry to begin certifying scholar presence.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
