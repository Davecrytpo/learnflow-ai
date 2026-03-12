import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InstructorGroups = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [groups, setGroups] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, title")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });
      setCourses(data || []);
      if (data && data.length > 0) setSelectedCourse(data[0].id);
      setLoading(false);
    };
    fetch();
  }, [user]);

  useEffect(() => {
    if (!selectedCourse) return;
    const fetch = async () => {
      const { data } = await (supabase.from as any)("course_groups")
        .select("*")
        .eq("course_id", selectedCourse)
        .order("created_at", { ascending: false });
      setGroups(data || []);
    };
    fetch();
  }, [selectedCourse]);

  const createGroup = async () => {
    if (!user || !selectedCourse || !name) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("course_groups")
      .insert({ course_id: selectedCourse, name })
      .select()
      .single();
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setGroups([data, ...groups]);
    setName("");
    toast({ title: "Group created" });
  };

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Cohorts</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Course groups</h1>
            <p className="mt-2 text-sm text-muted-foreground">Organize learners into cohorts for targeted instruction.</p>
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Create group</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : (
              <>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />
                <Button onClick={createGroup} disabled={saving || !name}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create group
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          {groups.length === 0 ? (
            <Card className="p-6 text-center text-sm text-muted-foreground">No groups yet.</Card>
          ) : groups.map(g => (
            <Card key={g.id}>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">{new Date(g.created_at).toLocaleDateString()}</p>
                <h3 className="mt-2 font-semibold text-foreground">{g.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorGroups;
