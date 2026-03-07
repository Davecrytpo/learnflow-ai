import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical, Microscope, Cpu, Dna, Atom, Rocket, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const facilities = [
  {
    title: "Quantum Physics Laboratory",
    desc: "Dedicated to the study of subatomic particles and quantum entanglement using ultra-low temperature cooling systems.",
    image: "https://images.unsplash.com/photo-1532187875605-1ef6c237ddc4?auto=format&fit=crop&q=80&w=800",
    icon: Atom,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    title: "Robotics & AI Research Center",
    desc: "A hub for developing autonomous systems, machine learning algorithms, and human-robot interaction models.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    icon: Cpu,
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  {
    title: "Genomics & Bioinformatics Lab",
    desc: "High-throughput sequencing facility focused on personalized medicine and genetic engineering.",
    image: "https://images.unsplash.com/photo-1579152276503-085a84e9c412?auto=format&fit=crop&q=80&w=800",
    icon: Dna,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    title: "Aerospace Innovation Hub",
    desc: "State-of-the-art wind tunnels and propulsion testing grounds for next-generation aviation technology.",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800",
    icon: Rocket,
    color: "text-rose-600",
    bg: "bg-rose-50"
  },
  {
    title: "Advanced Materials Synthesis",
    desc: "Focused on nanotechnology and smart materials for sustainable energy and construction.",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800",
    icon: FlaskConical,
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  {
    title: "Biomedical Imaging Suite",
    desc: "Equipped with the latest MRI, CT, and PET scan technologies for non-invasive medical research.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
    icon: Microscope,
    color: "text-cyan-600",
    bg: "bg-cyan-50"
  }
];

const Labs = () => {
  return (
    <PageLayout 
      title="Laboratories & Facilities" 
      subtitle="World-class infrastructure powering the next generation of global breakthroughs."
    >
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {facilities.map((lab, i) => (
            <motion.div
              key={lab.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden border-none shadow-sm shadow-slate-200 group cursor-pointer hover:shadow-xl transition-all duration-500 rounded-[2rem] bg-white">
                <div className="h-64 relative overflow-hidden">
                   <img 
                    src={lab.image} 
                    alt={lab.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />
                   <div className="absolute bottom-6 left-6">
                      <div className={`h-12 w-12 rounded-2xl ${lab.bg} flex items-center justify-center shadow-lg`}>
                         <lab.icon className={`h-6 w-6 ${lab.color}`} />
                      </div>
                   </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="font-display font-bold text-2xl mb-3 text-slate-900 group-hover:text-primary transition-colors">
                    {lab.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-6 line-clamp-3">
                    {lab.desc}
                  </p>
                  <Button variant="ghost" className="p-0 h-auto font-bold text-primary group/btn">
                    Explore Facility <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Technical Support Section */}
        <section className="mt-24 bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[100px] rounded-full" />
           <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                 <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Facility Access & Safety</h2>
                 <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    All laboratories are accessible to registered researchers and graduate students following a mandatory safety orientation. We maintain strict institutional protocols to ensure a secure research environment.
                 </p>
                 <div className="flex flex-wrap gap-4">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl">Book a Lab</Button>
                    <Button variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold h-12 px-8 rounded-xl">Safety Guidelines</Button>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: "Research Stations", value: "140+" },
                   { label: "Active Projects", value: "320+" },
                   { label: "Global Partners", value: "45" },
                   { label: "Safety Rating", value: "100%" }
                 ].map((stat, i) => (
                   <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Labs;
