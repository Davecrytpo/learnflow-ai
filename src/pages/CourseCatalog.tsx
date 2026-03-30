import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, BookOpen, Clock, Award, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import GraduationCapIcon from "@/components/icons/GraduationCapIcon";

const CourseCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [levelFilter, setLevelFilter] = useState(searchParams.get("level") || "All");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "All");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (levelFilter !== "All") params.append("level", levelFilter);
      if (categoryFilter !== "All") params.append("category", categoryFilter);
      if (searchQuery) params.append("search", searchQuery);

      const data = await apiClient.fetch(`/courses?${params.toString()}`);
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [levelFilter, categoryFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold mb-4">Academic Catalog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of programs and courses designed to prepare you for the future.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search programs, majors, or keywords..." 
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8">Search</Button>
            </form>

            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select 
                  className="h-12 bg-background border border-input rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                >
                  <option value="All">All Levels</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Doctoral">Doctoral</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>
              <select 
                className="h-12 bg-background border border-input rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Business">Business</option>
                <option value="Engineering">Engineering</option>
                <option value="Medicine">Medicine</option>
                <option value="Arts & Humanities">Arts & Humanities</option>
              </select>
            </div>
          </div>

          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading catalog...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed">
                <GraduationCapIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No programs found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                <Button variant="outline" onClick={() => { setSearchQuery(""); setLevelFilter("All"); setCategoryFilter("All"); }}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden border-slate-200">
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={course.cover_image_url || `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800`} 
                          alt={course.title}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
                            {course.level}
                          </span>
                        </div>
                      </div>
                      <CardHeader className="p-6 pb-2">
                        <div className="text-sm font-medium text-primary mb-2">{course.category}</div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                          {course.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                          {course.summary || course.description}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {course.duration || "4 Years"}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Award className="h-3.5 w-3.5" />
                            {course.credits || "120"} Credits
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button className="flex-1" asChild>
                            <Link to={`/course/${course._id}`}>Course Details</Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link to={`/admissions/apply-form?program=${encodeURIComponent(course.title)}`}>Apply Now</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
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
