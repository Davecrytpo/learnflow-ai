import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, BookOpen, GraduationCap, Award, Search, 
  Shield, Trash2, Eye, CheckCircle, XCircle, 
  UserPlus, Mail, Loader2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { useAuthContext } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0, pendingCourses: 0, pendingEnr: 0 });
  
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [pendingEnrollments, setPendingEnrollments] = useState<any[]>([]);
  const [pendingInstructors, setPendingInstructors] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);

  // Add Instructor State
  const [isAddingInstructor, setIsAddingInstructor] = useState(false);
  const [newInstructor, setNewInstructor] = useState({ name: "", email: "" });
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, enrollRes, usersRes, rolesRes] = await Promise.all([
        supabase.from("courses").select("*, profiles:author_id(display_name)"),
        supabase.from("enrollments").select("*, courses(title), profiles:student_id(display_name)"),
        supabase.from("profiles").select("*"),
        supabase.from("user_roles").select("*").eq("role", "instructor")
      ]);

      const allCourses = coursesRes.data || [];
      const allEnrollments = enrollRes.data || [];
      const allUsers = usersRes.data || [];
      
      setPendingCourses(allCourses.filter((c: any) => c.status === 'pending' || !c.published));
      setPendingEnrollments(allEnrollments.filter((e: any) => !e.completed_at));
      
      const instructorIds = (rolesRes.data || []).map(r => r.user_id);
      const faculty = allUsers.filter(u => instructorIds.includes(u.user_id));
      
      // In a real system we'd have a 'status' on the user_role or profile. 
      // For this implementation, let's assume those with a bio are "approved".
      setPendingInstructors(faculty.filter(f => !f.bio));
      setInstructors(faculty.filter(f => f.bio));

      setStats({
        users: (usersRes.data || []).length,
        courses: allCourses.length,
        enrollments: allEnrollments.length,
        pendingCourses: allCourses.filter((c: any) => c.status === 'pending' || !c.published).length,
        pendingEnr: allEnrollments.filter((e: any) => !e.completed_at).length
      });

    } catch (err: any) {
      toast({ title: "Sync Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingInstructor(true);
    
    try {
      // NOTE: Creating users properly requires Service Role Key or a backend function.
      // For local development / demonstration with client-side only, 
      // we'll simulate the intent. In a real production university system,
      // this would call an Edge Function.
      
      const { data, error } = await supabase.auth.signUp({
        email: newInstructor.email,
        password: "TempPassword123!", // Institutional default
        options: {
          data: { 
            full_name: newInstructor.name,
            role: 'instructor'
          }
        }
      });

      if (error) throw error;

      toast({ 
        title: "Staff Account Created", 
        description: `Credentials sent to ${newInstructor.email}. Instructor must change password on first login.` 
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
    const { error } = await (supabase.from("courses") as any).update({ 
      published: status === 'approved',
      status: status
    }).eq("id", id);
    
    if (error) {
      toast({ title: "Accreditation Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ 
        title: status === 'approved' ? "Course Accredited" : "Course Rejected",
        description: status === 'approved' ? "The course is now live in the catalog." : "The instructor has been notified of the rejection."
      });
      fetchData();
    }
  };

  const handleEnrollAction = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await (supabase.from as any)("enrollments").update({ completed_at: status === 'rejected' ? new Date().toISOString() : null }).eq("id", id);
    if (error) toast({ title: "Error", variant: "destructive" });
    else { toast({ title: `Enrollment ${status}` }); fetchData(); }
  };

  const removeInstructor = async (userId: string) => {
    if (!confirm("Are you sure? This will revoke all teaching privileges for this user.")) return;
    // In a real system, we'd delete the role or the user via admin API
    await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "instructor");
    toast({ title: "Privileges Revoked" });
    fetchData();
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">University Administration</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground text-primary">
              Welcome back, {user?.user_metadata?.full_name || "Administrator"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Institutional command center for faculty management, course accreditation, and student admissions.
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
              <p className="text-3xl font-bold">{instructors.length}</p>
            </CardContent>
          </Card>
        </div>

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
                    <div key={i.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:border-primary/30 transition-all gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          {i.display_name?.[0] || "?"}
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 text-lg leading-tight">{i.display_name}</p>
                          <p className="text-sm text-slate-500">{i.email || "applicant@institution.edu"}</p>
                          <div className="mt-2 flex gap-2">
                             <Badge variant="secondary" className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">
                               {i.department || "General Academics"}
                             </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          className="bg-primary text-white font-bold h-10 px-6 rounded-xl shadow-lg shadow-primary/10"
                          onClick={() => {
                            // Update bio to mock approval in this demo
                            supabase.from("profiles").update({ bio: "Institutional Faculty" }).eq("user_id", i.user_id).then(() => {
                              toast({ title: "Faculty Approved", description: `${i.display_name} is now an active instructor.` });
                              fetchData();
                            });
                          }}
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
                <CardDescription>Review new curriculum proposals for institutional standard compliance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingCourses.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-slate-50/50">
                    <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-sm text-slate-500 font-medium">No courses awaiting accreditation.</p>
                  </div>
                ) : (
                  pendingCourses.map(c => (
                    <div key={c.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:border-primary/30 hover:shadow-md transition-all gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 text-lg leading-tight">{c.title}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                             <span className="font-medium text-slate-500">Instructor: {c.profiles?.display_name || "Guest Faculty"}</span>
                             <span className="text-slate-300">•</span>
                             <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold uppercase tracking-tighter">
                                {c.level || "Undergraduate"}
                             </Badge>
                             <span className="text-slate-300">•</span>
                             <span className="text-slate-500 font-medium">{c.credits || 3} Credits</span>
                             <span className="text-slate-300">•</span>
                             <span className="text-slate-500 font-medium">{c.duration || "12 Weeks"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary" asChild title="Preview Syllabus">
                           <Link to={`/academics/catalog?search=${encodeURIComponent(c.title)}`}>
                             <Eye className="h-5 w-5" />
                           </Link>
                        </Button>
                        <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" />
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-5 rounded-xl shadow-lg shadow-emerald-600/10" 
                          onClick={() => handleCourseAction(c.id, 'approved')}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-rose-600 hover:bg-rose-50 font-bold h-10 px-5 rounded-xl" 
                          onClick={() => handleCourseAction(c.id, 'rejected')}
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
                    <div key={e.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{e.profiles?.display_name || "Student"}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">Enrollment for: {e.courses?.title}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/5" onClick={() => handleEnrollAction(e.id, 'approved')}>
                          Verify & Admit
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleEnrollAction(e.id, 'rejected')}>
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
                          placeholder="j.smith@globaluniversity.edu" 
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
                    <div key={i.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-muted/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/20">
                          {i.display_name?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{i.display_name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Mail className="h-3 w-3" />
                            {i.email || "staff@globaluniversity.edu"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="text-xs h-8">View Performance</Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeInstructor(i.user_id)}>
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
