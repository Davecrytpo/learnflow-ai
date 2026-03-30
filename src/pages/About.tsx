import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Target, Heart, Globe, Users, BookOpen, Award, ShieldCheck, Microscope } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const values = [
  { icon: Target, title: "Mission of Discovery", description: "Advancing human knowledge through rigorous research and innovative scholarship across all disciplines.", color: "from-blue-600 to-cyan-500" },
  { icon: ShieldCheck, title: "Academic Integrity", description: "Maintaining the highest standards of intellectual honesty and institutional transparency.", color: "from-slate-800 to-slate-600" },
  { icon: Globe, title: "Global Impact", description: "Preparing leaders to address the world's most complex challenges through education and research.", color: "from-indigo-600 to-purple-500" },
  { icon: Microscope, title: "Research Excellence", description: "Empowering faculty and students with state-of-the-art facilities to push the boundaries of science.", color: "from-emerald-600 to-teal-500" },
];

const stats = [
  { val: "120K+", lbl: "Active Students" },
  { val: "3,200+", lbl: "World-Class Faculty" },
  { val: "45", lbl: "Nobel Laureates" },
  { val: "$4.2B", lbl: "Annual Research Budget" }
];

const About = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
    <Navbar />
    <main className="flex-1">
      
      {/* Institutional Hero */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
           <img src="/images/hero-campus.jpg" alt="University Campus" className="w-full h-full object-cover opacity-30" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="bg-primary/20 text-primary-foreground border-none px-4 py-1 mb-6 text-xs font-bold uppercase tracking-[0.2em]">
               Est. 1994 • Cambridge, MA
            </Badge>
            <h1 className="mx-auto max-w-4xl font-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              A Legacy of <span className="text-primary italic font-normal">Excellence</span> and Innovation
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-xl text-slate-300 leading-relaxed font-medium">
              Global University Institute is a world-renowned academic institution dedicated to research excellence, transformative teaching, and preparing global leaders for a changing world.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-20 grid max-w-5xl grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((s) => (
              <div key={s.lbl} className="flex flex-col items-center">
                <p className="font-display text-4xl md:text-5xl font-bold text-white mb-2">{s.val}</p>
                <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">{s.lbl}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-8 leading-tight">
                Our Mission: To Advance <br /> Human Knowledge
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium">
                <p>
                  Since our founding, Global University Institute has remained at the forefront of academic achievement. Our commitment to interdisciplinary research has led to breakthrough discoveries in quantum computing, global health, and social policy.
                </p>
                <p>
                  We believe that education should be a catalyst for positive global change. By providing our students with access to world-class faculty and state-of-the-art facilities, we empower them to solve the most pressing challenges of our time.
                </p>
              </div>
              <div className="mt-10 flex gap-10">
                 <div>
                    <p className="text-3xl font-bold text-slate-900">#1</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Research</p>
                 </div>
                 <div className="w-px h-12 bg-slate-100" />
                 <div>
                    <p className="text-3xl font-bold text-slate-900">98%</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Faculty Satisfaction</p>
                 </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[600px]"
            >
               <img src="/images/campus-library.jpg" alt="Institutional Library" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-primary/10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">Institutional Pillars</h2>
            <p className="text-slate-500 text-lg font-medium">The core principles that guide our academic and research endeavors across the globe.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all group"
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${v.color} shadow-lg`}>
                  <v.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-sm">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-24 bg-white overflow-hidden">
         <div className="container mx-auto px-4 lg:px-8">
            <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 relative">
               <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full" />
               <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                  <div>
                     <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">A Truly Global <br /> Institution</h2>
                     <p className="text-slate-400 text-xl leading-relaxed mb-10">
                        With campus locations in Cambridge, Zurich, and Singapore, GUI provides a seamless academic experience that transcends borders. Our digital infrastructure enables students from 180+ countries to access our curriculum.
                     </p>
                     <div className="space-y-4">
                        {["180+ Countries Represented", "12 Global Research Hubs", "24/7 Digital Campus Access"].map((item, i) => (
                           <div key={i} className="flex items-center gap-4 text-white font-bold">
                              <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                              {item}
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="h-full">
                     <img src="/images/graduation.jpg" alt="Global Students" className="rounded-[3rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" />
                  </div>
               </div>
            </div>
         </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
