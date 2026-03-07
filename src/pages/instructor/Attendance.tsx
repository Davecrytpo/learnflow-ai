import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Calendar, Check, X, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
        const { data, error } = await supabase.from("courses").select("id, title").eq("author_id", user.id);
        if (error) throw error;
        setCourses(data || []);
        if (data && data.length > 0) setSelectedCourse(data[0].id);
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
      const { data } = await (supabase.from as any)("attendance_sessions").select("*").eq("course_id", selectedCourse).order("date", { ascending: false });
      setSessions(data || []);
      if (data && data.length > 0) setSelectedSession(data[0].id);
      else setSelectedSession("");
    };
    fetchSessions();
  }, [selectedCourse]);

  useEffect(() => {
    if (!selectedCourse || !selectedSession) {
      setStudents([]);
      return;
    }
    const fetchAttendance = async () => {
      const [enrollRes, recordRes] = await Promise.all([
        supabase.from("enrollments").select("student_id, profiles(display_name, avatar_url)").eq("course_id", selectedCourse),
        supabase.from("attendance_records").select("student_id, status").eq("session_id", selectedSession)
      ]);
      setStudents(enrollRes.data || []);
      const map: Record<string, string> = {};
      recordRes.data?.forEach(r => map[r.student_id] = r.status);
      setAttendanceMap(map);
    };
    fetchAttendance();
  }, [selectedSession, selectedCourse]);

  const createSession = async () => {
    if (!newDate || !selectedCourse) return;
    setCreating(true);
    const { data, error } = await supabase.from("attendance_sessions").insert({
      course_id: selectedCourse,
      date: newDate
    }).select().single();
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSessions([data, ...sessions]);
      setSelectedSession(data.id);
      toast({ title: "Session created" });
    }
    setCreating(false);
  };

  const markAttendance = async (studentId: string, status: string) => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
    await supabase.from("attendance_records").upsert({
      session_id: selectedSession,
      student_id: studentId,
      status
    }, { onConflict: "session_id,student_id" });
  };

  const markAll = async (status: string) => {
    const updates = students.map(s => ({
      session_id: selectedSession,
      student_id: s.student_id,
      status
    }));
    
    const newMap = { ...attendanceMap };
    students.forEach(s => newMap[s.student_id] = status);
    setAttendanceMap(newMap);

    await supabase.from("attendance_records").upsert(updates, { onConflict: "session_id,student_id" });
    toast({ title: `Marked all as ${status}` });
  };

  if (loading) return <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}><Loader2 className="mx-auto mt-20 animate-spin" /></DashboardLayout>;

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Attendance</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Attendance tracker</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Create sessions, mark attendance, and keep records aligned to your course schedule.
            </p>
          </div>
        </section>

        <div className="flex gap-4 items-end">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Select Course</label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
              <SelectContent>{courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">New Session Date</label>
            <div className="flex gap-2">
              <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
              <Button onClick={createSession} disabled={creating || !newDate}>
                {creating ? <Loader2 className="animate-spin" /> : "Create"}
              </Button>
            </div>
          </div>
        </div>

        {sessions.length > 0 && (
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">
                Session: <span className="text-primary">{sessions.find(s => s.id === selectedSession)?.date}</span>
              </CardTitle>
              <div className="flex gap-2">
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{sessions.map(s => <SelectItem key={s.id} value={s.id}>{s.date}</SelectItem>)}</SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={() => markAll('present')}>Mark All Present</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map(s => (
                    <TableRow key={s.student_id}>
                      <TableCell className="font-medium">{s.profiles?.display_name}</TableCell>
                      <TableCell className="text-center">
                        {attendanceMap[s.student_id] ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs uppercase font-bold ${
                            attendanceMap[s.student_id] === 'present' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            attendanceMap[s.student_id] === 'absent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {attendanceMap[s.student_id]}
                          </span>
                        ) : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => markAttendance(s.student_id, 'present')} title="Present">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50" onClick={() => markAttendance(s.student_id, 'late')} title="Late">
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => markAttendance(s.student_id, 'excused')} title="Excused">
                            <AlertCircle className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => markAttendance(s.student_id, 'absent')} title="Absent">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
