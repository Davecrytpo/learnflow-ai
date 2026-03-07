import { ReactNode } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  description?: string;
  children: ReactNode;
  backgroundImage?: string;
  showHero?: boolean;
}

const PageLayout = ({ 
  title, 
  subtitle,
  description, 
  children, 
  backgroundImage = "/images/campus-library.jpg",
  showHero = true
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      {showHero && (
        <section className="relative pt-40 pb-24 overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 z-0">
            <img 
              src={backgroundImage} 
              alt={title} 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>
          
          <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              {subtitle && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-bold uppercase tracking-wider mb-6">
                   {subtitle}
                </div>
              )}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 tracking-tight leading-[1.1]">
                {title}
              </h1>
              {(description || subtitle) && (
                <p className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed font-medium">
                  {description || subtitle}
                </p>
              )}
            </motion.div>
          </div>
        </section>
      )}

      <main className="flex-grow relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default PageLayout;
