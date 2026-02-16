import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, BookOpen, Users } from "lucide-react";

const categories = ["All", "Technology", "Science", "Mathematics", "English/Language Arts", "Social Studies", "Business", "Arts", "Health Sciences", "Engineering", "Other"];

const CourseCatalog = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, title, slug, summary, cover_image_url, category, author_id, profiles:author_id(display_name)")
        .eq("published", true)
        .order("created_at", { ascending: false });
      setCourses(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || (c.summary || "").toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === "All" || (c.category || "").toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Course Catalog</h1>
          <p className="mt-2 text-muted-foreground">Browse all available courses — completely free to enroll.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button key={cat} size="sm" variant={category === cat ? "default" : "outline"} onClick={() => setCategory(cat)}>
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)
            : filtered.length === 0
            ? (
              <div className="col-span-full py-20 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <p className="mt-4 text-muted-foreground">No courses found.</p>
              </div>
            )
            : filtered.map((course) => (
              <Link to={`/course/${course.id}`} key={course.id}>
                <Card className="overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
                  <div className="h-36 bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-primary/30" />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-foreground line-clamp-1">{course.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{course.summary || "No description"}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{course.category || "General"}</span>
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">Free</span>
                    </div>
                    {course.profiles && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{course.profiles.display_name || "Instructor"}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseCatalog;
