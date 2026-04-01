import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Mail, Building2, MapPin, GraduationCap, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

const InstructorProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, courseRes] = await Promise.all([
          apiClient.db.from("profiles").select("*").eq("user_id", user.id).single(),
          apiClient.fetch("/instructor/courses")
        ]);

        setProfile(profileRes.data);
        setCourses(courseRes || []);
      } catch (error: any) {
        toast({ title: "Profile load failed", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast, user]);

  const handleSave = async () => {
    if (!user || !profile) {
      return;
    }

    setSaving(true);
    try {
      await apiClient.db.from("profiles").update({
        display_name: profile.display_name,
        bio: profile.bio,
        city: profile.city,
        institution: profile.institution,
        department: profile.department,
        specialization: profile.specialization
      }).eq("user_id", user.id).execute();

      toast({ title: "Profile updated" });
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="mx-auto max-w-6xl space-y-8 pb-24">
        <section className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-slate-800 bg-slate-950 p-6 md:p-10 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_40%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,1))]" />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
              <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-white/10">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-indigo-500/20 text-2xl md:text-3xl text-indigo-100">
                  {profile?.display_name?.charAt(0) || "I"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Badge className="border-none bg-indigo-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">
                  Faculty Identity
                </Badge>
                <h1 className="mt-4 font-display text-2xl md:text-4xl font-bold">{profile?.display_name || user?.display_name || "Instructor"}</h1>
                <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-300">
                  Maintain your faculty profile, instructional summary, and teaching metadata in one place.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:grid-cols-3">
              <Card className="border border-white/10 bg-white/5 text-white shadow-none">
                <CardContent className="p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Courses</p>
                  <p className="mt-2 text-3xl font-black">{courses.length}</p>
                </CardContent>
              </Card>
              <Card className="border border-white/10 bg-white/5 text-white shadow-none">
                <CardContent className="p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Role</p>
                  <p className="mt-2 text-lg font-bold">Instructor</p>
                </CardContent>
              </Card>
              <Card className="border border-white/10 bg-white/5 text-white shadow-none">
                <CardContent className="p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</p>
                  <p className="mt-2 text-lg font-bold capitalize">{profile?.status || "active"}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          <div className="space-y-8">
            <Card className="rounded-[2rem] border-none bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Faculty Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                  <Mail className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Email</p>
                    <p className="text-sm font-semibold text-slate-900">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                  <Building2 className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Institution</p>
                    <p className="text-sm font-semibold text-slate-900">{profile?.institution || "Global University Institute"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                  <GraduationCap className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Department</p>
                    <p className="text-sm font-semibold text-slate-900">{profile?.department || "Faculty"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                  <Briefcase className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Specialization</p>
                    <p className="text-sm font-semibold text-slate-900">{profile?.specialization || "Teaching and curriculum design"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Active Programs</CardTitle>
                <CardDescription>Courses currently attached to your faculty account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {courses.length === 0 ? (
                  <p className="text-sm text-slate-500">No instructor courses created yet.</p>
                ) : (
                  courses.slice(0, 5).map((course) => (
                    <div key={course.id || course._id} className="rounded-2xl border border-slate-100 p-4">
                      <p className="font-semibold text-slate-900">{course.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{course.category || "Academic"}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-[2rem] border-none bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Edit Faculty Profile</CardTitle>
              <CardDescription>These details appear across the instructor workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label>Display Name</Label>
                <Input value={profile?.display_name || ""} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Professional Bio</Label>
                <Textarea rows={6} value={profile?.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Institution</Label>
                  <Input value={profile?.institution || ""} onChange={(e) => setProfile({ ...profile, institution: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Department</Label>
                  <Input value={profile?.department || ""} onChange={(e) => setProfile({ ...profile, department: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Specialization</Label>
                  <Input value={profile?.specialization || ""} onChange={(e) => setProfile({ ...profile, specialization: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <Input className="pl-9" value={profile?.city || ""} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="h-12 rounded-xl bg-indigo-600 px-6 font-bold hover:bg-indigo-700">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorProfile;

