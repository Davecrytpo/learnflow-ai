import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, BookOpen, GraduationCap, Search, 
  Trash2, Eye, CheckCircle, XCircle, 
  UserPlus, Mail, Loader2, Sparkles, TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { generateInstitutionalReport } from "@/lib/anthropic";

const AdminDashboard = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0, pendingCourses: 0, activeInstructors: 0 });
  
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const [aiReport, setAiReport] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  const [isAddingInstructor, setIsAddingInstructor] = useState(false);
  const [newInstructor, setNewInstructor] = useState({ name: "", email: "" });
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [metricsRes, coursesRes, usersRes] = await Promise.all([
        api.get("/metrics/overview"),
        api.get("/courses"),
        api.get("/admin/users")
      ]);

      setStats(metricsRes.data);
      setAllCourses(coursesRes.data);
      setAllUsers(usersRes.data);
    } catch (err: any) {
      toast({ title: "Sync Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingCourses = allCourses.filter(c => c.status === "pending" || !c.published);
  const instructors = allUsers.filter(u => u.role === "instructor");
  const pendingInstructors = allUsers.filter(u => u.role === "instructor" && u.status === "pending");

  const handleCourseAction = async (id: string, action: "approve" | "reject") => {
    try {
      await api.patch(`/admin/courses/${id}/status`, {
        status: action === "approve" ? "approved" : "rejected",
        published: action === "approve"
      });
      toast({ title: action === "approve" ? "Course Accredited" : "Course Rejected" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Operation Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleUserStatus = async (userId: string, status: string) => {
    try {
      await api.patch(`/admin/users/${userId}`, { status });
      toast({ title: `User ${status}` });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const systemData = {
        stats,
        recentCourses: pendingCourses.length,
        instructorCount: instructors.length
      };
      const report = await generateInstitutionalReport(systemData);
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
      // In MongoDB version, we use the signup endpoint or a specific admin-staff endpoint
      await api.post("/auth/signup", {
        email: newInstructor.email,
        password: "TempPassword123!", 
        role: "instructor",
        display_name: newInstructor.name
      });

      toast({ 
        title: "Staff Account Created", 
        description: `Credentials set for ${newInstructor.email}.` 
      });
      
      setIsInstructorModalOpen(false);
      setNewInstructor({ name: "", email: "" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Operation Failed", description: err.response?.data?.error || err.message, variant: "destructive" });
    } finally {
      setIsAddingInstructor(false);
    }
  };

  const removeInstructor = async (userId: string) => {
    if (!confirm("Are you sure? This will revoke all teaching privileges.")) return;
    try {
      await api.patch(`/admin/users/${userId}`, { role: "student" });
      toast({ title: "Privileges Revoked" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </DashboardLayout>
    );
  }

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
              Welcome back, Administrator. Managing {stats.users} students and {stats.activeInstructors} faculty.
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
                className="prose prose-invert max-w-none bg-white/5 p-6 rounded-2xl border border-white/10"
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
                          <p className="text-sm text-slate-500">{i.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          className="bg-primary text-white font-bold h-10 px-6 rounded-xl"
                          onClick={() => handleUserStatus(i._id, 'active')}
                        >
                          Approve Faculty
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive font-bold h-10 px-6 rounded-xl hover:bg-destructive/5" onClick={() => handleUserStatus(i._id, 'rejected')}>Reject</Button>
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
                          <p className="text-xs text-slate-500 font-medium">Instructor: {c.author_id?.display_name || "Faculty"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-5 rounded-xl" 
                          onClick={() => handleCourseAction(c._id, 'approve')}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-rose-600 hover:bg-rose-50 font-bold h-10 px-5 rounded-xl" 
                          onClick={() => handleCourseAction(c._id, 'reject')}
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
                            {i.email}
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
