import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Award, Shield, MapPin, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const [profRes, certRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("certificates").select("*, courses(title)").eq("user_id", user.id)
      ]);
      setProfile(profRes.data);
      setCertificates(certRes.data || []);
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      display_name: profile.display_name,
      bio: profile.bio,
      city: profile.city,
      institution: profile.institution,
    }).eq("user_id", user?.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <DashboardLayout allowedRoles={["student", "instructor", "admin"]} sidebar={<StudentSidebar />}>
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={["student", "instructor", "admin"]} sidebar={<StudentSidebar />}>
      <div className="space-y-6 max-w-5xl mx-auto">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Profile</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Your profile</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Keep your details up to date and track achievements in one place.
            </p>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-muted">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="text-2xl">{profile?.display_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{profile?.display_name}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary" className="gap-1"><Shield className="h-3 w-3" /> Student</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">Achievements</CardTitle></CardHeader>
              <CardContent>
                {certificates.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No certificates yet.</p>
                ) : (
                  <div className="space-y-3">
                    {certificates.map(c => (
                      <div key={c.id} className="flex items-center gap-3 rounded-lg border p-3">
                        <Award className="h-8 w-8 text-accent" />
                        <div>
                          <p className="text-sm font-semibold line-clamp-1">{c.courses?.title}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(c.issued_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Edit Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Full Name</Label>
                <Input value={profile?.display_name || ""} onChange={e => setProfile({...profile, display_name: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Bio</Label>
                <Textarea value={profile?.bio || ""} onChange={e => setProfile({...profile, bio: e.target.value})} rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" value={profile?.city || ""} onChange={e => setProfile({...profile, city: e.target.value})} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Institution</Label>
                  <div className="relative">
                    <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" value={profile?.institution || ""} onChange={e => setProfile({...profile, institution: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
