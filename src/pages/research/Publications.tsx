import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Share2, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const publications = [
  {
    title: "Neural Architectures for Ethical AI: A Global Framework",
    authors: "Dr. Elena Rodriguez, Prof. Alan Turing",
    journal: "Nature Machine Intelligence",
    year: "2026",
    category: "Artificial Intelligence",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Quantum Supremacy in Materials Synthesis",
    authors: "Prof. Hiroshi Tanaka et al.",
    journal: "Science",
    year: "2025",
    category: "Quantum Physics",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Sustainable Urbanization in the Global South",
    authors: "Dr. Sarah Johnson",
    journal: "Journal of Sustainable Development",
    year: "2026",
    category: "Social Sciences",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "CRISPR-Cas9 Applications in Personalized Oncology",
    authors: "Prof. Michael Chen, Dr. Li Wei",
    journal: "The Lancet",
    year: "2025",
    category: "Biotechnology",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800"
  }
];

const Publications = () => {
  return (
    <PageLayout 
      title="Academic Publications" 
      subtitle="Disseminating groundbreaking research to the global community."
    >
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto mb-16">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input 
                placeholder="Search publications by title, author, or keyword..." 
                className="h-16 pl-12 pr-6 rounded-2xl bg-white shadow-lg border-none text-lg"
              />
           </div>
           <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {["All", "Artificial Intelligence", "Quantum Physics", "Social Sciences", "Biotechnology", "Economics"].map(cat => (
                <Badge key={cat} variant="secondary" className="px-4 py-1.5 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors">
                   {cat}
                </Badge>
              ))}
           </div>
        </div>

        <div className="grid gap-8">
          {publications.map((pub, i) => (
            <motion.div
              key={pub.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden border-none shadow-sm shadow-slate-200 hover:shadow-xl transition-all duration-300 rounded-[2.5rem] bg-white group">
                <div className="flex flex-col md:flex-row">
                   <div className="w-full md:w-64 h-48 md:h-auto relative overflow-hidden shrink-0">
                      <img src={pub.image} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <CardContent className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                           <Badge className="bg-primary/10 text-primary border-none font-bold">{pub.category}</Badge>
                           <span className="text-sm font-bold text-slate-400">{pub.year}</span>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                          {pub.title}
                        </h3>
                        <p className="text-slate-500 font-medium mb-1">Authors: {pub.authors}</p>
                        <p className="text-sm text-primary font-bold italic">Published in {pub.journal}</p>
                      </div>
                      <div className="flex gap-4 mt-8 pt-6 border-t border-slate-50">
                         <Button variant="outline" size="sm" className="rounded-xl font-bold gap-2">
                            <Download className="h-4 w-4" /> PDF Full Text
                         </Button>
                         <Button variant="ghost" size="sm" className="rounded-xl font-bold gap-2">
                            <Share2 className="h-4 w-4" /> Citation
                         </Button>
                      </div>
                   </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Publications;
