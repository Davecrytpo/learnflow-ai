import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  CheckCircle, FileText, UserPlus, Upload, CreditCard, 
  Mail, ArrowRight, GraduationCap, Building2, HelpCircle 
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Create Your Account",
    desc: "Register on our student portal to start your application journey.",
    icon: UserPlus,
    color: "bg-blue-500"
  },
  {
    title: "Fill Application Form",
    desc: "Provide your personal, academic, and contact details accurately.",
    icon: FileText,
    color: "bg-purple-500"
  },
  {
    title: "Upload Documents",
    desc: "Submit your transcripts, ID, and personal statement.",
    icon: Upload,
    color: "bg-emerald-500"
  },
  {
    title: "Pay Application Fee",
    desc: "Complete the process by paying the $50 non-refundable fee.",
    icon: CreditCard,
    color: "bg-amber-500"
  },
  {
    title: "Receive Admission Decision",
    desc: "Our team will review your application and notify you via email.",
    icon: Mail,
    color: "bg-rose-500"
  }
];

const Apply = () => {
  return (
    <PageLayout 
      title="How to Apply" 
      description="Follow our streamlined 5-step process to join the Global University Institute community."
      backgroundImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          
          <div className="grid md:grid-cols-2 gap-16 items-start mb-24">
            <div className="space-y-8">
              <h2 className="text-4xl font-display font-bold text-slate-900 leading-tight">
                Everything you need to <span className="text-primary italic">apply successfully</span>.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Global University Institute seeks students who are curious, motivated, and ready to lead. Our application process is designed to be comprehensive yet accessible.
              </p>
              
              <div className="space-y-4">
                {[
                  "Undergraduate deadline: Jan 15th",
                  "Graduate application cycles: Fall & Spring",
                  "No application fee for international students",
                  "Financial aid options available"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="font-medium text-slate-700">{text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Button size="lg" className="h-14 px-10 rounded-full font-bold shadow-xl shadow-primary/20" asChild>
                  <Link to="/admissions/apply-form">Start Your Application <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Building2 className="h-40 w-40" />
               </div>
               <h3 className="text-2xl font-bold mb-6">Requirements</h3>
               <ul className="space-y-6 relative z-10">
                 <li className="flex gap-4">
                   <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">1</div>
                   <p className="text-slate-300"><strong className="text-white block">Transcripts</strong> High school or university transcripts (Official copies).</p>
                 </li>
                 <li className="flex gap-4">
                   <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">2</div>
                   <p className="text-slate-300"><strong className="text-white block">Identification</strong> Valid passport or government-issued ID.</p>
                 </li>
                 <li className="flex gap-4">
                   <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">3</div>
                   <p className="text-slate-300"><strong className="text-white block">English Proficiency</strong> IELTS, TOEFL, or equivalent for non-native speakers.</p>
                 </li>
               </ul>
            </div>
          </div>

          <div className="space-y-12">
            <h2 className="text-3xl font-display font-bold text-center">The Application Process</h2>
            <div className="grid md:grid-cols-5 gap-4 relative">
              {/* Process Line */}
              <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-slate-100 z-0" />
              
              {steps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative z-10 text-center space-y-4"
                >
                  <div className={`h-24 w-24 ${step.color} text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform`}>
                    <step.icon className="h-10 w-10" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-slate-500 px-2 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-24 p-12 bg-primary/5 rounded-[3rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm shadow-primary/10">
                <HelpCircle className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Need assistance?</h3>
                <p className="text-slate-600">Our admissions counselors are available to answer your questions.</p>
              </div>
            </div>
            <Button variant="outline" size="lg" className="h-14 px-10 rounded-full font-bold border-primary text-primary hover:bg-primary hover:text-white transition-all" asChild>
              <Link to="/admissions/contact">Contact Admissions</Link>
            </Button>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default Apply;
