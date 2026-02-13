import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Clock, Users, CheckCircle, Loader2 } from "lucide-react";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    const fetch = async () => {
      const [courseRes, modRes, lessonRes, enrollCountRes] = await Promise.all([
        supabase.from("courses").select("*, profiles:author_id(display_name, avatar_url)").eq("id", courseId).single(),
        supabase.from("modules").select("*").eq("course_id", courseId).order("order"),
        supabase.from("lessons").select("id, title, module_id, duration_seconds, order").eq("course_id", courseId).eq("published", true).order("order"),
        supabase.from("enrollments").select("id").eq("course_id", courseId),
      ]);
      setCourse(courseRes.data);
      setModules(modRes.data || []);
      setLessons(lessonRes.data || []);
      setEnrollmentCount(enrollCountRes.data?.length || 0);

      if (user) {
        const { data } = await supabase.from("enrollments").select("id").eq("course_id", courseId).eq("student_id", user.id).maybeSingle();
        setIsEnrolled(!!data);
      }
      setLoading(false);
    };
    fetch();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) { navigate("/login"); return; }
    if (!courseId) return;
    setEnrolling(true);
    const { error } = await supabase.from("enrollments").insert({ course_id: courseId, student_id: user.id });
    setEnrolling(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setIsEnrolled(true);
      toast({ title: "Enrolled!", description: "You can now access the course." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Course not found.</p>
        </div>
      </div>
    );
  }

  const totalDuration = lessons.reduce((acc, l) => acc + (l.duration_seconds || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-8">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{course.category || "General"}</span>
              <h1 className="mt-4 text-3xl font-bold text-foreground">{course.title}</h1>
              <p className="mt-2 text-muted-foreground">{course.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {lessons.length} lessons</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {Math.round(totalDuration / 60)} min</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {enrollmentCount} students</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground">About this course</h2>
              <p className="mt-2 text-muted-foreground whitespace-pre-line">{course.description || "No description provided."}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground">Curriculum</h2>
              <div className="mt-4 space-y-3">
                {modules.map((mod) => (
                  <Card key={mod.id}>
                    <CardContent className="py-4">
                      <h3 className="font-semibold text-foreground">{mod.title}</h3>
                      <div className="mt-2 space-y-1">
                        {lessons.filter((l) => l.module_id === mod.id).map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-3 w-3" />
                            <span>{lesson.title}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {modules.length === 0 && <p className="text-sm text-muted-foreground">Curriculum coming soon.</p>}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="space-y-4 pt-6">
                <p className="text-3xl font-bold text-foreground">
                  {course.price_cents > 0 ? `$${(course.price_cents / 100).toFixed(2)}` : "Free"}
                </p>
                {isEnrolled ? (
                  <Button className="w-full" asChild>
                    <a href={`/course/${courseId}/learn`}>Continue Learning</a>
                  </Button>
                ) : (
                  <Button className="w-full" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {course.price_cents > 0 ? "Buy & Enroll" : "Enroll for Free"}
                  </Button>
                )}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Full lifetime access</p>
                  <p>✓ Certificate of completion</p>
                  <p>✓ {lessons.length} lessons</p>
                </div>
                {course.profiles && (
                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground">Instructor</p>
                    <p className="font-medium text-foreground">{course.profiles.display_name || "Instructor"}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
