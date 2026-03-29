import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, BookOpen, GraduationCap, Award, Search, 
  Shield, Trash2, Eye, CheckCircle, XCircle, 
  UserPlus, Mail, Loader2, Sparkles, TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { generateInstitutionalReport } from "@/lib/ai-service";
import { apiClient } from "@/lib/api-client";

const AdminDashboard = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0, pendingCourses: 0, pendingEnr: 0, activeInstructors: 0 });
  
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [pendingEnrollments, setPendingEnrollments] = useState<any[]>([]);
  const [pendingInstructors, setPendingInstructors] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);

  // AI Reporting
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Add Instructor State
  const [isAddingInstructor, setIsAddingInstructor] = useState(false);
  const [newInstructor, setNewInstructor] = useState({ name: "", email: "" });
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, pendingCoursesData, pendingEnrData, pendingInstData, allInstData] = await Promise.all([
        apiClient.fetch("/admin/stats"),
        apiClient.fetch("/admin/pending-courses"),
        apiClient.fetch("/admin/pending-enrollments"),
        apiClient.fetch("/admin/faculty-apps"),
        apiClient.fetch("/admin/instructors")
      ]);

      setStats(statsData);
      setPendingCourses(pendingCoursesData);
      setPendingEnrollments(pendingEnrData);
      setPendingInstructors(pendingInstData);
      setInstructors(allInstData);

    } catch (err: any) {
      toast({ title: "Sync Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const report = await generateInstitutionalReport(stats);
      setAiReport(report);
    } catch (err: any) {
      toast({ title: "Report Generation Failed", description: err.message, variant: "destructive" });
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingInstructor(true);
    
    try {
      await apiClient.fetch("/admin/create-instructor", {
        method: "POST",
        body: JSON.stringify({
          email: newInstructor.email,
          name: newInstructor.name,
          department: "General Faculty",
          specialization: "Institutional Instruction"
        })
      });

      toast({ 
        title: "Faculty invite sent", 
        description: `A setup email was sent to ${newInstructor.email}.` 
      });

      setIsInstructorModalOpen(false);
      setNewInstructor({ name: "", email: "" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Operation Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsAddingInstructor(false);
    }
  };

  const handleCourseAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await apiClient.fetch(`/admin/courses/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ 
          published: status === 'approved',
          status: status
        })
      });
      
      toast({ title: status === 'approved' ? "Course Accredited" : "Course Rejected" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Accreditation Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleEnrollAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await apiClient.fetch(`/admin/enrollments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      toast({ title: `Enrollment ${status}` }); 
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const removeInstructor = async (id: string) => {
    if (!confirm("Are you sure? This will revoke all teaching privileges.")) return;
    try {
      await apiClient.fetch(`/admin/instructors/${id}`, { method: "DELETE" });
      toast({ title: "Privileges Revoked" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const approveFaculty = async (id: string) => {
    try {
      await apiClient.fetch(`/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: 'approved' })
      });
      toast({ title: "Faculty Approved" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">University Administration</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-primary">
              Institutional Command Center
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Welcome back, {user?.display_name || "Administrator"}. Managing {stats.users} students and {stats.activeInstructors} faculty.
            </p>
          </div>
        </section>

        {/* Actionable Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase text-primary tracking-widest">Pending Accreditation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.pendingCourses}</p>
            </CardContent>
          </Card>
          <Card className="border-accent/20 bg-accent/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase text-accent tracking-widest">Admissions Waiting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{stats.pendingEnr}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.users}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Faculty Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.activeInstructors}</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Institutional Report Section */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <TrendingUp className="h-32 w-32 text-white" />
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-display font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" /> AI Institutional Report
                </CardTitle>
                <CardDescription className="text-slate-400">Generate an executive analysis of institutional health and growth.</CardDescription>
              </div>
              <Button 
                onClick={handleGenerateReport} 
                disabled={generatingReport}
                className="bg-primary hover:bg-primary/90 text-white font-bold"
              >
                {generatingReport ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Executive Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {aiReport ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="prose prose-invert max-w-none bg-white/5 p-6 rounded-2xl border border-white/10 text-slate-900"
                dangerouslySetInnerHTML={{ __html: aiReport }}
              />
            ) : (
              <div className="text-center py-8 text-slate-400 italic">
                Click the button to analyze system-wide trends, faculty productivity, and enrollment growth.
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="course-approvals" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="course-approvals">Course Accreditation ({stats.pendingCourses})</TabsTrigger>
            <TabsTrigger value="faculty-apps">Faculty Applications ({pendingInstructors.length})</TabsTrigger>
            <TabsTrigger value="enrollments">Tuition Verification ({stats.pendingEnr})</TabsTrigger>
            <TabsTrigger value="instructors">Active Faculty</TabsTrigger>
          </TabsList>

          <TabsContent value="faculty-apps">
            <Card className="border-none shadow-sm shadow-slate-200">
              <CardHeader>
                <CardTitle className="text-xl">Faculty Recruitment Queue</CardTitle>
                <CardDescription>Review credentials of prospective institutional instructors.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingInstructors.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-slate-50/50">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-sm text-slate-500 font-medium">No pending faculty applications.</p>
                  </div>
                ) : (
                  pendingInstructors.map(i => (
                    <div key={i._id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:border-primary/30 transition-all gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          {i.display_name?.[0] || "?"}
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 text-lg leading-tight">{i.display_name}</p>
                          <p className="text-sm text-slate-500">{i.email || "applicant@institution.edu"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          className="bg-primary text-white font-bold h-10 px-6 rounded-xl"
                          onClick={() => approveFaculty(i._id)}
                        >
                          Approve Faculty
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive font-bold h-10 px-6 rounded-xl hover:bg-destructive/5">Reject</Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="course-approvals">
            <Card className="border-none shadow-sm shadow-slate-200">
              <CardHeader>
                <CardTitle className="text-xl">Academic Accreditation Queue</CardTitle>
                <CardDescription>Review new curriculum proposals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingCourses.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-slate-50/50">
                    <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-sm text-slate-500 font-medium">No courses awaiting accreditation.</p>
                  </div>
                ) : (
                  pendingCourses.map(c => (
                    <div key={c._id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:border-primary/30 transition-all gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 text-lg leading-tight">{c.title}</p>
                          <p className="text-xs text-slate-500 font-medium">Instructor: {c.author_id?.display_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-5 rounded-xl" 
                          onClick={() => handleCourseAction(c._id, 'approved')}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-rose-600 hover:bg-rose-50 font-bold h-10 px-5 rounded-xl" 
                          onClick={() => handleCourseAction(c._id, 'rejected')}
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enrollments">
            <Card>
              <CardHeader>
                <CardTitle>Admissions & Tuition</CardTitle>
                <CardDescription>Grant course access after financial verification.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingEnrollments.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-12 border-2 border-dashed rounded-2xl">No pending student admissions.</p>
                ) : (
                  pendingEnrollments.map(e => (
                    <div key={e._id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{e.student_id?.display_name || "Student"}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">Enrollment for: {e.course_id?.title}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/5" onClick={() => handleEnrollAction(e._id, 'approved')}>
                          Verify & Admit
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleEnrollAction(e._id, 'rejected')}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instructors">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Faculty Registry</CardTitle>
                  <CardDescription>Authorized teaching staff management.</CardDescription>
                </div>
                
                <Dialog open={isInstructorModalOpen} onOpenChange={setIsInstructorModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-white">
                      <UserPlus className="mr-2 h-4 w-4" /> Add Instructor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Register New Faculty Member</DialogTitle></DialogHeader>
                    <form onSubmit={handleAddInstructor} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input 
                          placeholder="e.g. Dr. Jane Smith" 
                          value={newInstructor.name} 
                          onChange={e => setNewInstructor({...newInstructor, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Staff Email</Label>
                        <Input 
                          type="email" 
                          placeholder="j.smith@institution.edu" 
                          value={newInstructor.email}
                          onChange={e => setNewInstructor({...newInstructor, email: e.target.value})}
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setIsInstructorModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isAddingInstructor}>
                          {isAddingInstructor && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Create Account
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {instructors.map(i => (
                    <div key={i._id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-muted/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/20">
                          {i.display_name?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{i.display_name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Mail className="h-3 w-3" />
                            {i.email || "staff@institution.edu"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeInstructor(i._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
