import { ReactNode } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  backgroundImage?: string;
  showHero?: boolean;
}

const PageLayout = ({ 
  title, 
  description, 
  children, 
  backgroundImage = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000",
  showHero = true
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {showHero && (
        <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 z-0">
            <img 
              src={backgroundImage} 
              alt={title} 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-background" />
          </div>
          
          <div className="container relative z-10 mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
                  {description}
                </p>
              )}
            </motion.div>
          </div>
        </section>
      )}

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default PageLayout;
