import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, BookOpen, Sparkles, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const categories = ["All", "Technology", "Science", "Mathematics", "English/Language Arts", "Social Studies", "Business", "Arts", "Health Sciences", "Engineering", "Other"];

const categoryColors: Record<string, string> = {
  Technology: "from-primary to-emerald-400",
  Science: "from-emerald-500 to-teal-400",
  Mathematics: "from-primary to-accent",
  "English/Language Arts": "from-accent to-amber-400",
  "Social Studies": "from-emerald-500 to-teal-400",
  Business: "from-primary to-emerald-400",
  Arts: "from-accent to-amber-300",
  "Health Sciences": "from-emerald-500 to-teal-400",
  Engineering: "from-accent to-orange-500",
};

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
      <main>
        <section className="relative overflow-hidden border-b border-border pt-32 pb-16">
          <div className="absolute inset-0 bg-aurora" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="container relative mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Course Catalog</p>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Explore All Courses
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {courses.length} courses across every subject - completely free to enroll.
              </p>
            </motion.div>

            <div className="mx-auto mt-10 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search courses, topics, instructors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 rounded-xl border-border bg-card pl-11 pr-4 text-sm focus:border-primary"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  category === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)
              : filtered.length === 0
              ? (
                <div className="col-span-full flex flex-col items-center py-24 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
                    <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <p className="mt-4 font-display text-lg font-semibold text-foreground">No courses found</p>
                  <p className="mt-1 text-sm text-muted-foreground">Try a different search or category</p>
                </div>
              )
              : filtered.map((course, i) => {
                const gradColor = categoryColors[course.category] || "from-primary to-emerald-400";
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link to={`/course/${course.id}`} className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                      <div className={`relative h-40 bg-gradient-to-br ${gradColor} overflow-hidden`}>
                        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />
                        <div className="absolute bottom-3 left-3">
                          <span className="rounded-md border border-white/20 bg-black/30 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            {course.category || "General"}
                          </span>
                        </div>
                        <div className="absolute right-3 top-3">
                          <span className="rounded-md border border-white/20 bg-black/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            Free
                          </span>
                        </div>
                        <GraduationCap className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-white/10" />
                      </div>

                      <div className="p-4">
                        <h3 className="font-display font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
                        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{course.summary || "No description"}</p>
                        {course.profiles && (
                          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                              {(course.profiles.display_name || "I").charAt(0)}
                            </div>
                            <span>{course.profiles.display_name || "Instructor"}</span>
                          </div>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Sparkles className="h-3 w-3 text-accent" />
                            <span>Includes certificate</span>
                          </div>
                          <span className="text-xs font-semibold text-primary group-hover:underline">View -&gt;</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CourseCatalog;
