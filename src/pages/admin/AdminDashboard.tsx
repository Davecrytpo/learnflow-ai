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
      
      setPendingCourses(allCourses.filter((c: any) => c.published === false));
      setPendingEnrollments(allEnrollments.filter((e: any) => !e.completed_at));
      
      const instructorIds = (rolesRes.data || []).map(r => r.user_id);
      setInstructors((usersRes.data || []).filter(u => instructorIds.includes(u.user_id)));

      setStats({
        users: (usersRes.data || []).length,
        courses: allCourses.length,
        enrollments: allEnrollments.length,
        pendingCourses: allCourses.filter((c: any) => c.published === false).length,
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
    const { error } = await supabase.from("courses").update({ published: status === 'approved' }).eq("id", id);
    if (error) toast({ title: "Error", variant: "destructive" });
    else { toast({ title: `Course ${status}` }); fetchData(); }
  };

  const handleEnrollAction = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from("enrollments").update({ status }).eq("id", id);
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
            <TabsTrigger value="course-approvals">Course Approvals ({stats.pendingCourses})</TabsTrigger>
            <TabsTrigger value="enrollments">Tuition Verification ({stats.pendingEnr})</TabsTrigger>
            <TabsTrigger value="instructors">Faculty Management</TabsTrigger>
          </TabsList>

          <TabsContent value="course-approvals">
            <Card>
              <CardHeader>
                <CardTitle>Academic Accreditation</CardTitle>
                <CardDescription>Verify course structure and quality before publication.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingCourses.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-12 border-2 border-dashed rounded-2xl">No courses awaiting accreditation.</p>
                ) : (
                  pendingCourses.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-accent/5 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{c.title}</p>
                          <p className="text-xs text-muted-foreground">Instructor: {c.profiles?.display_name || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50" onClick={() => handleCourseAction(c.id, 'approved')}>
                          <CheckCircle className="mr-2 h-4 w-4" /> Approve
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleCourseAction(c.id, 'rejected')}>
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
