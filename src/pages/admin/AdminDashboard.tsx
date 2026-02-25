import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, BookOpen, GraduationCap, Award, Search, Shield, Trash2, Eye, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0, pendingCourses: 0, pendingEnr: 0 });
  
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [pendingEnrollments, setPendingEnrollments] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);

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
      
      setPendingCourses(allCourses.filter(c => c.status === 'pending'));
      setPendingEnrollments(allEnrollments.filter(e => e.status === 'pending'));
      
      // Get list of instructor user_ids to fetch their profiles
      const instructorIds = (rolesRes.data || []).map(r => r.user_id);
      setInstructors((usersRes.data || []).filter(u => instructorIds.includes(u.user_id)));

      setStats({
        users: (usersRes.data || []).length,
        courses: allCourses.length,
        enrollments: allEnrollments.length,
        pendingCourses: allCourses.filter(c => c.status === 'pending').length,
        pendingEnr: allEnrollments.filter(e => e.status === 'pending').length
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

  const handleCourseAction = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from("courses").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", variant: "destructive" });
    else { toast({ title: `Course ${status}` }); fetchData(); }
  };

  const handleEnrollAction = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from("enrollments").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", variant: "destructive" });
    else { toast({ title: `Enrollment ${status}` }); fetchData(); }
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">University Administration</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Global University Institute</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Centralized control for user verification, course accreditation, and enrollment processing.
            </p>
          </div>
        </section>

        {/* Actionable Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase text-primary">Pending Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.pendingCourses}</p>
            </CardContent>
          </Card>
          <Card className="border-accent/20 bg-accent/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase text-accent">Pending Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{stats.pendingEnr}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.users}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Total Instructors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{instructors.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="course-approvals" className="space-y-6">
          <TabsList className="bg-card/80">
            <TabsTrigger value="course-approvals">Course Approvals ({stats.pendingCourses})</TabsTrigger>
            <TabsTrigger value="enrollments">Enrollment Approvals ({stats.pendingEnr})</TabsTrigger>
            <TabsTrigger value="instructors">Manage Instructors</TabsTrigger>
          </TabsList>

          <TabsContent value="course-approvals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Course Accreditation</CardTitle>
                <CardDescription>Verify course structure and content before making it live.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingCourses.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-8">No courses awaiting approval.</p>
                ) : (
                  pendingCourses.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
                      <div>
                        <p className="font-bold text-foreground">{c.title}</p>
                        <p className="text-xs text-muted-foreground">Instructor: {c.profiles?.display_name || "N/A"}</p>
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
                <CardTitle>Tuition Verification</CardTitle>
                <CardDescription>Confirm tuition payment before granting course access.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingEnrollments.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-8">No pending registrations.</p>
                ) : (
                  pendingEnrollments.map(e => (
                    <div key={e.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
                      <div>
                        <p className="font-bold text-foreground">{e.profiles?.display_name || "Student"}</p>
                        <p className="text-xs text-muted-foreground">Enrolling in: {e.courses?.title}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-primary text-primary" onClick={() => handleEnrollAction(e.id, 'approved')}>
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
              <CardHeader>
                <CardTitle>Instructor Management</CardTitle>
                <CardDescription>Assign teaching staff and monitor performance.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {instructors.map(i => (
                    <div key={i.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {i.display_name?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{i.display_name}</p>
                          <p className="text-xs text-muted-foreground">{i.institution || "Faculty Member"}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Assign Courses</Button>
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
