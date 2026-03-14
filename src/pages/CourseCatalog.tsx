import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, BookOpen, GraduationCap, Filter, 
  Clock, Award, ArrowRight, Check
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Technology", "Science", "Mathematics", "Business", "Arts", "Health", "Engineering", "Humanities"];
const levels = ["All", "Undergraduate", "Graduate", "Doctoral", "Certificate", "Online"];

const CourseCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get("level") || "All");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (search) params.search = search;
        if (selectedCategory !== "All") params.category = selectedCategory;
        if (selectedLevel !== "All") params.level = selectedLevel;

        const response = await api.get("/courses", { params });
        setCourses(response.data);
      } catch (err: any) {
        console.error("Course catalog fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [search, selectedCategory, selectedLevel]);

  useEffect(() => {
    const newParams: any = {};
    if (search) newParams.search = search;
    if (selectedCategory !== "All") newParams.category = selectedCategory;
    if (selectedLevel !== "All") newParams.level = selectedLevel;
    setSearchParams(newParams);
  }, [search, selectedCategory, selectedLevel, setSearchParams]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedLevel("All");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img 
            src="/images/campus-library.jpg" 
            alt="Library" 
            className="h-full w-full object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>
        <div className="relative container mx-auto h-full px-4 flex flex-col justify-center items-center text-center pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <Badge className="bg-primary/20 text-primary-foreground border-none px-4 py-1 mb-6 backdrop-blur-sm">
              Academic Year 2026-2027
            </Badge>
            <h1 className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl mb-6">
              Empowering Global Minds
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover over {courses.length > 0 ? courses.length : "150"} accredited programs across 12 disciplines. 
              Find the degree path that aligns with your future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <div className="relative w-full max-w-md">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                 <Input 
                   placeholder="Search by degree, major, or course name..." 
                   className="h-14 pl-12 bg-white/95 border-none text-slate-900 rounded-2xl shadow-2xl focus:ring-2 ring-primary"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                 />
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16 flex-1">
        
        {/* Academic Schools / Paths */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold text-slate-900">Academic Schools</h2>
            <Button variant="link" className="text-primary font-bold">Explore All Faculties <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {degreePaths.map((path, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className={`h-14 w-14 rounded-2xl ${path.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/20`}>
                  <path.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{path.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{path.desc}</p>
                <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  View Programs <ArrowRight className="h-3 w-3" />
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-12 border-t border-slate-200 pt-16">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-10">
            <div className="sticky top-24 space-y-10">
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" /> Filter Results
                </h3>
                <div className="h-1 w-10 bg-primary rounded-full" />
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400">Program Level</h4>
                <div className="space-y-3">
                  {levels.map((level) => (
                    <div key={level} className="flex items-center">
                      <Checkbox 
                        id={`level-${level}`} 
                        checked={selectedLevel === level}
                        onCheckedChange={() => setSelectedLevel(level)}
                        className="rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label 
                        htmlFor={`level-${level}`}
                        className="ml-3 text-sm font-semibold text-slate-600 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setSelectedLevel(level)}
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400">Discipline</h4>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center">
                      <Checkbox 
                        id={`cat-${cat}`} 
                        checked={selectedCategory === cat}
                        onCheckedChange={() => setSelectedCategory(cat)}
                        className="rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label 
                        htmlFor={`cat-${cat}`}
                        className="ml-3 text-sm font-semibold text-slate-600 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant="ghost" 
                className="w-full text-slate-400 hover:text-primary hover:bg-transparent font-bold"
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-display font-bold text-slate-900">
                  {selectedCategory !== "All" ? selectedCategory : "Academic"} Catalog
                </h2>
                <p className="text-slate-500 mt-1">Showing {filtered.length} accredited courses found.</p>
              </div>
              <div className="flex gap-2">
                 <Badge variant="outline" className="px-3 py-1 font-bold">{selectedLevel}</Badge>
                 {selectedCategory !== "All" && <Badge variant="outline" className="px-3 py-1 font-bold">{selectedCategory}</Badge>}
              </div>
            </div>

            {loading ? (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full rounded-[2rem]" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 text-center shadow-sm">
                <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                  <BookOpen className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No programs found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                  Try adjusting your search terms or filters to find your desired course.
                </p>
                <Button onClick={clearFilters} variant="outline" className="rounded-xl px-8">Reset Search</Button>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((course, i) => {
                  const gradColor = categoryColors[course.category] || "from-blue-600 to-indigo-600";
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i % 3 * 0.1 }}
                      className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    >
                      {/* Card Image Header */}
                      <Link to={`/course/${course.id}`} className="relative h-56 overflow-hidden">
                        {course.cover_image_url ? (
                          <img 
                            src={course.cover_image_url} 
                            alt={course.title} 
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className={`h-full w-full bg-gradient-to-br ${gradColor} p-6 flex items-center justify-center relative`}>
                            <GraduationCap className="h-16 w-16 text-white/20" />
                          </div>
                        )}
                        <div className="absolute top-6 left-6">
                          <Badge className="bg-white/95 text-slate-900 hover:bg-white backdrop-blur-md font-bold px-4 py-1.5 rounded-xl shadow-lg">
                            {course.category || "General"}
                          </Badge>
                        </div>
                      </Link>

                      {/* Card Content */}
                      <div className="p-8 flex flex-col flex-1">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-primary mb-4 uppercase tracking-[0.2em]">
                          <span className="bg-primary/5 px-2 py-1 rounded text-primary">
                             {course.level || "Undergraduate"}
                          </span>
                          {course.credits && <span>• {course.credits} Credits</span>}
                        </div>
                        
                        <Link to={`/course/${course.id}`} className="block">
                          <h3 className="font-display font-bold text-2xl text-slate-900 leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                            {course.title}
                          </h3>
                        </Link>
                        
                        <p className="text-slate-500 text-sm line-clamp-2 mb-8 flex-1 leading-relaxed">
                          {course.summary || "Explore the core foundations of this discipline through advanced research and practical application."}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                           <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                             <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {course.duration || "12 Weeks"}</span>
                           </div>
                           <Link 
                             to={`/course/${course.id}`} 
                             className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center transition-all group-hover:bg-primary group-hover:scale-110"
                           >
                             <ArrowRight className="h-4 w-4" />
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
