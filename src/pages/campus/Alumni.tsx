import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PageLayout from "@/components/layout/PageLayout";
import { Globe, Briefcase, Award, Users } from "lucide-react";

const Alumni = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <PageLayout
      title="Alumni Network"
      subtitle="A global community of leaders and innovators."
      backgroundImage="/images/graduation.jpg"
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">Stay Connected to the Institute</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              The Global University Institute Alumni Association connects more than 250,000 alumni worldwide. 
              As a graduate, you are part of a lifelong community dedicated to excellence, leadership, and service.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Briefcase, title: "Career Services", desc: "Access exclusive job boards and career coaching." },
                { icon: Globe, title: "Global Chapters", desc: "Connect with local alumni in over 120 countries." },
                { icon: Award, title: "Lifelong Learning", desc: "Discounts on continuing education and certifications." },
                { icon: Users, title: "Mentorship", desc: "Guide current scholars as they prepare for their careers." },
              ].map((benefit) => (
                <div key={benefit.title} className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
                  <benefit.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <aside className="space-y-6">
            <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-4">Alumni Reunion 2026</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Join us on campus this Fall for a weekend of networking, academic seminars, and celebration.
              </p>
              <button className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">Register Now</button>
            </div>
            
            <div className="p-8 rounded-[2rem] border border-border bg-card">
              <h3 className="text-xl font-bold mb-4 text-foreground">Update Your Info</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Ensure you receive the latest news and invitations from your alma mater.
              </p>
              <button className="w-full py-3 border border-border text-foreground font-bold rounded-xl hover:bg-secondary transition-colors">Update Profile</button>
            </div>
          </aside>
        </div>
      </div>
    </PageLayout>
    <Footer />
  </div>
);

export default Alumni;
