import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Calendar, Target, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const grants = [
  {
    title: "Global Excellence Research Grant",
    amount: "$500,000",
    deadline: "October 15, 2026",
    description: "Supporting large-scale international collaborations in health and technology sectors.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    category: "Institutional"
  },
  {
    title: "Innovation in Education Award",
    amount: "$50,000",
    deadline: "November 30, 2026",
    description: "For faculty developing groundbreaking online teaching methodologies.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
    category: "Faculty"
  },
  {
    title: "STEM Diversity Fellowship",
    amount: "Full Tuition + Stipend",
    deadline: "December 1, 2026",
    description: "Empowering underrepresented groups in advanced scientific research.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    category: "Student"
  },
  {
    title: "Sustainable Futures Initiative",
    amount: "$250,000",
    deadline: "January 15, 2027",
    description: "Focusing on carbon-neutral campus solutions and green technologies.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
    category: "Environmental"
  }
];

const Grants = () => {
  return (
    <PageLayout 
      title="Grants & Funding" 
      subtitle="Empowering researchers and students through institutional support."
    >
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {grants.map((grant, i) => (
            <motion.div
              key={grant.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden border-none shadow-sm shadow-slate-200 hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white group h-full flex flex-col">
                <div className="h-64 relative overflow-hidden shrink-0">
                   <img src={grant.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                   <div className="absolute top-6 right-6">
                      <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm font-bold border-none px-4 py-1">
                         {grant.category}
                      </Badge>
                   </div>
                   <div className="absolute bottom-6 left-6">
                      <p className="text-white text-3xl font-bold font-display">{grant.amount}</p>
                   </div>
                </div>
                <CardContent className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                      {grant.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed mb-6 font-medium">
                      {grant.description}
                    </p>
                    <div className="flex flex-col gap-3">
                       <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>Deadline: {grant.deadline}</span>
                       </div>
                       <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                          <Target className="h-4 w-4 text-primary" />
                          <span>Global Eligibility</span>
                       </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-50">
                    <Button className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg shadow-slate-200">
                       Start Grant Application
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Institutional Funding Notice */}
        <section className="mt-20 text-center max-w-3xl mx-auto">
           <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
              <Award className="h-8 w-8" />
           </div>
           <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Support Your Initiative</h2>
           <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
              Global University Institute provides over $45M in annual funding to support research excellence and student innovation. Contact the Office of Research for tailored funding guidance.
           </p>
           <Button variant="outline" size="lg" className="rounded-2xl border-slate-200 h-14 px-10 font-bold hover:bg-slate-50">
              View All Opportunities <ArrowRight className="ml-2 h-4 w-4" />
           </Button>
        </section>
      </div>
    </PageLayout>
  );
};

export default Grants;
