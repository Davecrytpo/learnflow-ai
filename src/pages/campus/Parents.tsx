import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PageLayout from "@/components/layout/PageLayout";
import { Users, Shield, Heart, GraduationCap } from "lucide-react";

const Parents = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <PageLayout
      title="Parents & Families"
      subtitle="Partnering with you for student success."
      backgroundImage="/images/campus-life.jpg"
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">Supporting Your Student's Journey</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              At Global University Institute, we recognize that families are vital partners in our students' education. 
              We are committed to providing the resources and information you need to support your student from admission to graduation.
            </p>
            <div className="grid gap-6">
              {[
                { icon: Shield, title: "Safety & Wellness", desc: "Our 24/7 campus security and comprehensive health services." },
                { icon: Heart, title: "Family Resources", desc: "Dedicated support for families to navigate university life." },
                { icon: GraduationCap, title: "Academic Success", desc: "Guidance on how students can excel in their chosen fields." },
              ].map((f) => (
                <div key={f.title} className="flex gap-4 p-6 rounded-2xl bg-card border border-border">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img src="/images/graduation.jpg" alt="Graduation" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-8 rounded-3xl shadow-xl hidden md:block">
              <p className="text-2xl font-display font-bold">98%</p>
              <p className="text-xs uppercase tracking-widest font-bold opacity-80">Graduate Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
    <Footer />
  </div>
);

export default Parents;
