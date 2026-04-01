import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calculator, Landmark, ArrowRight, CheckCircle, 
  DollarSign, FileCheck, Globe, HelpCircle 
} from "lucide-react";
import GraduationCapIcon from "@/components/icons/GraduationCapIcon";
import { Link } from "react-router-dom";

const Tuition = () => {
  return (
    <PageLayout 
      title="Tuition and Financial Aid" 
      description="Investing in your future is the most important decision you'll make. We're here to help make it affordable."
      backgroundImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto space-y-24">
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="rounded-[2rem] border-slate-200 shadow-xl overflow-hidden group">
              <CardHeader className="bg-slate-900 text-white p-8">
                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Undergraduate</p>
                <CardTitle className="text-3xl">$42,500</CardTitle>
                <p className="text-slate-400 text-sm italic">per academic year</p>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Full-time tuition
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Campus facilities access
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Student health services
                  </li>
                </ul>
                <Button className="w-full h-12 rounded-xl font-bold" asChild>
                  <Link to="/admissions/apply-form">Apply Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-slate-200 shadow-xl overflow-hidden">
              <CardHeader className="bg-primary text-white p-8">
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">Graduate</p>
                <CardTitle className="text-3xl">$38,000</CardTitle>
                <p className="text-white/60 text-sm italic">per academic year</p>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Specialized lab access
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Research funding pool
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Professional networking
                  </li>
                </ul>
                <Button className="w-full h-12 rounded-xl font-bold bg-slate-900" asChild>
                  <Link to="/admissions/apply-form">Start Application</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-slate-200 shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-50 text-slate-900 p-8">
                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Online Learning</p>
                <CardTitle className="text-3xl">$12,000</CardTitle>
                <p className="text-slate-400 text-sm italic">per academic year</p>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500" /> 24/7 Digital Library
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Flexible scheduling
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Global peer network
                  </li>
                </ul>
                <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-slate-200" asChild>
                  <Link to="/academics/online">Explore Courses</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-display font-bold text-slate-900">Types of <span className="text-primary">Financial Aid</span></h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Over 85% of GUI students receive some form of financial assistance. We offer merit-based scholarships, need-based grants, and work-study programs.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
                  <GraduationCapIcon className="h-8 w-8 text-primary" />

                  <h4 className="font-bold">Merit Scholarships</h4>
                  <p className="text-xs text-slate-500">Based on academic, athletic, or artistic excellence.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
                  <Landmark className="h-8 w-8 text-primary" />
                  <h4 className="font-bold">Need-Based Grants</h4>
                  <p className="text-xs text-slate-500">Institutional aid based on demonstrated financial need.</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button size="lg" className="h-14 px-10 rounded-full font-bold shadow-xl shadow-primary/20" asChild>
                  <Link to="/admissions/contact?subject=Financial Aid Inquiry">Talk to a Financial Counselor</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2959210?auto=format&fit=crop&q=80&w=1000" 
                className="rounded-[3rem] shadow-2xl"
                alt="Financial Aid Counseling"
              />
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 max-w-xs hidden md:block">
                <Calculator className="h-10 w-10 text-primary mb-4" />
                <h4 className="font-bold text-lg mb-2">Net Price Calculator</h4>
                <p className="text-xs text-slate-500 mb-4">Get an estimate of your costs and aid in less than 5 minutes.</p>
                <Button variant="ghost" className="text-primary font-bold p-0 hover:bg-transparent">Try it now <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default Tuition;
