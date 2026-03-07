import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, BookOpen, Sparkles, GraduationCap, Filter, 
  Clock, Calendar, Award, ChevronDown, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Technology", "Science", "Mathematics", "Business", "Arts", "Health", "Engineering", "Humanities"];
const levels = ["All", "Undergraduate", "Graduate", "Doctoral", "Certificate", "Online"];

const categoryColors: Record<string, string> = {
  Technology: "from-blue-600 to-cyan-500",
  Science: "from-emerald-600 to-teal-500",
  Mathematics: "from-indigo-600 to-purple-500",
  Business: "from-slate-700 to-slate-500",
  Arts: "from-rose-500 to-orange-400",
  Health: "from-red-500 to-pink-500",
  Engineering: "from-orange-500 to-amber-500",
  Humanities: "from-yellow-500 to-amber-400",
};

const CourseCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data, error } = await (supabase
          .from("courses") as any)
          .select("id, title, slug, summary, cover_image_url, category, author_id, level, duration, credits, profiles:author_id(display_name)")
          .eq("published", true)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setCourses(data || []);
      } catch (err: any) {
        console.error("Course catalog fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Update URL params when search changes
  useEffect(() => {
    if (search) {
      setSearchParams({ search });
    } else {
      setSearchParams({});
    }
  }, [search, setSearchParams]);

  const filtered = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || (c.summary || "").toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || (c.category || "").toLowerCase() === selectedCategory.toLowerCase();
    const matchesLevel = selectedLevel === "All" || (c.level || "Undergraduate").toLowerCase() === selectedLevel.toLowerCase();
    return matchesSearch && matchesCat && matchesLevel;
  });

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedLevel("All");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img 
            src="/images/campus-library.jpg" 
            alt="Library" 
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        </div>
        <div className="relative container mx-auto h-full px-4 flex flex-col justify-center items-center text-center pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-6">
              Find Your Future
            </h1>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-8">
              Explore over {courses.length > 0 ? courses.length : "100+"} world-class courses across diverse disciplines.
              From undergraduate degrees to professional certificates.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-8">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search catalog..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-white border-slate-200 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500">Program Level</h4>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <div key={level} className="flex items-center">
                      <Checkbox 
                        id={`level-${level}`} 
                        checked={selectedLevel === level}
                        onCheckedChange={() => setSelectedLevel(level)}
                        className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label 
                        htmlFor={`level-${level}`}
                        className="ml-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        onClick={() => setSelectedLevel(level)}
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500">Subject Area</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center">
                      <Checkbox 
                        id={`cat-${cat}`} 
                        checked={selectedCategory === cat}
                        onCheckedChange={() => setSelectedCategory(cat)}
                        className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label 
                        htmlFor={`cat-${cat}`}
                        className="ml-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-slate-300 hover:bg-slate-100 text-slate-600"
                onClick={clearFilters}
              >
                Reset All Filters
              </Button>
            </div>
          </aside>

          {/* Mobile Filters */}
          <div className="lg:hidden mb-6">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-between">
                  <span className="flex items-center gap-2"><Filter className="h-4 w-4" /> Filter Courses</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Courses</SheetTitle>
                  <SheetDescription>Find the perfect program for you.</SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-8">
                  {/* Same filters as desktop */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500">Program Level</h4>
                    <div className="space-y-2">
                      {levels.map((level) => (
                        <div key={level} className="flex items-center">
                          <Checkbox 
                            id={`mobile-level-${level}`} 
                            checked={selectedLevel === level}
                            onCheckedChange={() => setSelectedLevel(level)}
                          />
                          <label htmlFor={`mobile-level-${level}`} className="ml-3 text-sm font-medium">{level}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500">Subject Area</h4>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <div key={cat} className="flex items-center">
                          <Checkbox 
                            id={`mobile-cat-${cat}`} 
                            checked={selectedCategory === cat}
                            onCheckedChange={() => setSelectedCategory(cat)}
                          />
                          <label htmlFor={`mobile-cat-${cat}`} className="ml-3 text-sm font-medium">{cat}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => setMobileFiltersOpen(false)} className="w-full">Show Results</Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search catalog..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-slate-900">
                {selectedCategory !== "All" ? selectedCategory : "All"} Courses
                <span className="ml-3 text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full align-middle">
                  {filtered.length} results
                </span>
              </h2>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 text-center">
                <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-6">
                  We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.
                </p>
                <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((course, i) => {
                  const gradColor = categoryColors[course.category] || "from-blue-600 to-indigo-600";
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Card Image Header */}
                      <Link to={`/course/${course.id}`} className="relative h-48 overflow-hidden">
                        {course.cover_image_url ? (
                          <img 
                            src={course.cover_image_url} 
                            alt={course.title} 
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className={`h-full w-full bg-gradient-to-br ${gradColor} p-6 flex items-center justify-center relative`}>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
                            <GraduationCap className="h-16 w-16 text-white/20" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm font-bold shadow-sm">
                            {course.category || "General"}
                          </Badge>
                        </div>
                      </Link>

                      {/* Card Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-3 uppercase tracking-wider">
                          <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 border-none rounded-md px-2">
                             {course.level || "Undergraduate"}
                          </Badge>
                          {course.credits && <span className="text-slate-400">• {course.credits} Credits</span>}
                        </div>
                        
                        <Link to={`/course/${course.id}`} className="block">
                          <h3 className="font-display font-bold text-lg text-slate-900 leading-snug mb-2 group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                        </Link>
                        
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                          {course.summary || "This course offers a comprehensive introduction to the subject matter, preparing students for advanced study and professional application."}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                           <div className="flex items-center gap-2 text-xs text-slate-500">
                             <Clock className="h-3.5 w-3.5" />
                             <span>{course.duration || "12 Weeks"}</span>
                           </div>
                           <Link 
                             to={`/course/${course.id}`} 
                             className="text-sm font-bold text-primary flex items-center gap-1 group/btn"
                           >
                             View Details 
                             <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                           </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseCatalog;
