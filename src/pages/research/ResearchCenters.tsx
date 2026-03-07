import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Microscope, Globe, Brain, Zap, FlaskConical, BarChart3, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const centers = [
  {
    title: "Center for Artificial Intelligence",
    subtitle: "Pioneering the future of machine learning and ethical AI development.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    icon: Brain,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    title: "Global Health Research Institute",
    subtitle: "Addressing world health challenges through innovative medical research.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800",
    icon: Microscope,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    title: "Institute for Sustainable Energy",
    subtitle: "Developing clean energy solutions for a carbon-neutral global future.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  {
    title: "Social Policy & Governance Hub",
    subtitle: "Analyzing global trends to shape future-proof governance models.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=800",
    icon: Globe,
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  {
    title: "Advanced Bio-Engineering Lab",
    subtitle: "Integrating engineering principles with biological sciences.",
    image: "https://images.unsplash.com/photo-1532187875605-1ef6c237ddc4?auto=format&fit=crop&q=80&w=800",
    icon: FlaskConical,
    color: "text-rose-600",
    bg: "bg-rose-50"
  },
  {
    title: "Data Science & Economic Center",
    subtitle: "Leveraging big data to solve complex economic puzzles.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    icon: BarChart3,
    color: "text-cyan-600",
    bg: "bg-cyan-50"
  }
];

const ResearchCenters = () => {
  return (
    <PageLayout 
      title="Research Centers" 
      subtitle="Interdisciplinary hubs of innovation and global discovery."
    >
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {centers.map((center, i) => (
            <motion.div
              key={center.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden border-none shadow-sm shadow-slate-200 group cursor-pointer hover:shadow-xl transition-all duration-500 rounded-[2rem] bg-white">
                <div className="h-64 relative overflow-hidden">
                   <img 
                    src={center.image} 
                    alt={center.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />
                   <div className="absolute bottom-6 left-6">
                      <div className={`h-12 w-12 rounded-2xl ${center.bg} flex items-center justify-center shadow-lg`}>
                         <center.icon className={`h-6 w-6 ${center.color}`} />
                      </div>
                   </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="font-display font-bold text-2xl mb-3 text-slate-900 group-hover:text-primary transition-colors">
                    {center.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-6 line-clamp-3">
                    {center.subtitle}
                  </p>
                  <Button variant="ghost" className="p-0 h-auto font-bold text-primary group/btn">
                    Visit Center <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default ResearchCenters;
