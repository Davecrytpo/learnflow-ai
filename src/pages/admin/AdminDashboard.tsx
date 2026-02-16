import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, BookOpen, GraduationCap, Award, Search, Shield, Trash2, Eye, EyeOff } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0, certificates: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [roleData, setRoleData] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const [profilesRes, coursesRes, enrollRes, certRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("id, user_id, display_name, email:user_id, institution, created_at"),
        supabase.from("courses").select("id, title, published, category, created_at, author_id, profiles:author_id(display_name)"),
        supabase.from("enrollments").select("id"),
        supabase.from("certificates").select("id"),
        supabase.from("user_roles").select("id, user_id, role"),
      ]);

      const allProfiles = profilesRes.data || [];
      const allRoles = rolesRes.data || [];
      const allCourses = coursesRes.data || [];

      setStats({
        users: allProfiles.length,
        courses: allCourses.length,
        enrollments: enrollRes.data?.length || 0,
        certificates: certRes.data?.length || 0,
      });

      // Merge roles into profiles
      const usersWithRoles = allProfiles.map(p => ({
        ...p,
        role: allRoles.find(r => r.user_id === p.user_id)?.role || "none",
        role_id: allRoles.find(r => r.user_id === p.user_id)?.id,
      }));
      setUsers(usersWithRoles);
      setCourses(allCourses);

      // Role distribution
      const studentCount = allRoles.filter(r => r.role === "student").length;
      const instructorCount = allRoles.filter(r => r.role === "instructor").length;
      const adminCount = allRoles.filter(r => r.role === "admin").length;
      setRoleData([
        { name: "Students", value: studentCount },
        { name: "Instructors", value: instructorCount },
        { name: "Admins", value: adminCount },
      ]);

      setLoading(false);
    };
    fetch();
  }, []);

  const changeUserRole = async (userId: string, currentRoleId: string | undefined, newRole: string) => {
    if (currentRoleId) {
      await supabase.from("user_roles").update({ role: newRole as any }).eq("id", currentRoleId);
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role: newRole as any });
    }
    setUsers(users.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
    toast({ title: "Role updated" });
  };

  const toggleCoursePublish = async (courseId: string, current: boolean) => {
    await supabase.from("courses").update({ published: !current }).eq("id", courseId);
    setCourses(courses.map(c => c.id === courseId ? { ...c, published: !current } : c));
    toast({ title: current ? "Course unpublished" : "Course published" });
  };

  const deleteCourse = async (courseId: string) => {
    await supabase.from("courses").delete().eq("id", courseId);
    setCourses(courses.filter(c => c.id !== courseId));
    toast({ title: "Course deleted" });
  };

  const COLORS = ["hsl(220, 90%, 53%)", "hsl(168, 76%, 42%)", "hsl(0, 84%, 60%)"];

  const filteredUsers = users.filter(u =>
    (u.display_name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.user_id || "").toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Users", value: stats.users, icon: Users, color: "text-primary" },
            { label: "Total Courses", value: stats.courses, icon: BookOpen, color: "text-accent" },
            { label: "Enrollments", value: stats.enrollments, icon: GraduationCap, color: "text-primary" },
            { label: "Certificates", value: stats.certificates, icon: Award, color: "text-accent" },
          ].map(s => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{s.value}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        {!loading && roleData.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-lg">User Role Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={roleData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Courses by Status</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { name: "Published", count: courses.filter(c => c.published).length },
                    { name: "Draft", count: courses.filter(c => !c.published).length },
                  ]}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="courses">Course Moderation</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="rounded-lg border border-border">
              <div className="grid grid-cols-4 gap-4 border-b border-border bg-muted/50 p-3 text-xs font-medium text-muted-foreground">
                <span>Name</span>
                <span>Institution</span>
                <span>Role</span>
                <span>Actions</span>
              </div>
              {loading ? (
                <div className="p-4"><Skeleton className="h-8" /></div>
              ) : filteredUsers.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No users found.</p>
              ) : (
                filteredUsers.slice(0, 50).map(u => (
                  <div key={u.id} className="grid grid-cols-4 items-center gap-4 border-b border-border p-3 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.display_name || "—"}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{u.institution || "—"}</p>
                    <Select value={u.role} onValueChange={(v) => changeUserRole(u.user_id, u.role_id, v)}>
                      <SelectTrigger className="h-8 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground capitalize">{u.role}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search courses..." value={courseSearch} onChange={e => setCourseSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="rounded-lg border border-border">
              <div className="grid grid-cols-5 gap-4 border-b border-border bg-muted/50 p-3 text-xs font-medium text-muted-foreground">
                <span className="col-span-2">Title</span>
                <span>Instructor</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {loading ? (
                <div className="p-4"><Skeleton className="h-8" /></div>
              ) : filteredCourses.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No courses found.</p>
              ) : (
                filteredCourses.slice(0, 50).map(c => (
                  <div key={c.id} className="grid grid-cols-5 items-center gap-4 border-b border-border p-3 last:border-0">
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.category || "General"}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{(c as any).profiles?.display_name || "—"}</p>
                    <span className={`inline-block w-fit rounded-full px-2 py-0.5 text-xs ${c.published ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                      {c.published ? "Published" : "Draft"}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleCoursePublish(c.id, c.published)}>
                        {c.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCourse(c.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
