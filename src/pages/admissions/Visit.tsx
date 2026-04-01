import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, Calendar, Clock, Camera, Coffee, 
  Map as MapIcon, Navigation, Bus, Info,
  CheckCircle 
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Visit = () => {
  const tours = [
    {
      title: "Guided Campus Tour",
      time: "10:00 AM & 2:00 PM",
      desc: "A 90-minute walking tour led by our student ambassadors.",
      icon: Navigation,
      subject: "Guided Campus Tour"
    },
    {
      title: "Self-Guided Tour",
      time: "Anytime (9 AM - 6 PM)",
      desc: "Explore at your own pace with our interactive digital map.",
      icon: MapIcon,
      subject: "Self-Guided Tour"
    },
    {
      title: "Virtual Reality Tour",
      time: "Online 24/7",
      desc: "Experience 360-degree views of our labs and libraries.",
      icon: Camera,
      subject: "Virtual Reality Tour"
    }
  ];

  return (
    <PageLayout 
      title="Visit Our Campus" 
      description="See for yourself why Global University Institute is the perfect place to grow and excel."
      backgroundImage="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-display font-bold text-slate-900 leading-tight">
                Experience the <span className="text-primary">GUI Spirit</span> in person.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We believe the best way to understand our culture is to breathe the air, walk the halls, and meet the people who make GUI special. Our campus is open for prospective students and their families throughout the year.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-primary shrink-0">
                    <Bus className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Easy Access</h4>
                    <p className="text-sm text-slate-500">Shuttle services available from Central Station and Innovation Airport.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-primary shrink-0">
                    <Coffee className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Visitor Center</h4>
                    <p className="text-sm text-slate-500">Stop by for a map, a fresh coffee, and a chat with our welcoming staff.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Button size="lg" className="h-14 px-10 rounded-full font-bold shadow-xl" asChild>
                  <Link to="/admissions/contact?subject=Schedule a Tour">Book a Guided Tour</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-full font-bold shadow-sm hover:shadow-md transition-all" asChild>
                  <Link to="/admissions/contact?subject=Request Campus Map">Request Campus Map</Link>
                </Button>
              </div>
            </div>

            <div className="relative group">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000" 
                className="rounded-[3rem] shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
                alt="Campus View"
              />
              <div className="absolute -top-6 -right-6 bg-primary text-white p-6 rounded-[2rem] shadow-xl max-w-[180px] hidden md:block">
                <p className="text-2xl font-bold">150+</p>
                <p className="text-xs text-white/80">Acres of modern architectural beauty.</p>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <h3 className="text-3xl font-display font-bold text-center">Tour Options</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {tours.map((tour, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="rounded-[2.5rem] border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-10 space-y-6 text-center">
                      <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
                        <tour.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">{tour.title}</h4>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                          <Clock className="h-3 w-3" /> {tour.time}
                        </p>
                        <p className="text-slate-500 text-sm leading-relaxed">{tour.desc}</p>
                      </div>
                      <Button variant="ghost" className="font-bold text-primary" asChild>
                        <Link to={`/admissions/contact?subject=${encodeURIComponent(tour.subject)}`}>Learn More</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-24 bg-slate-50 rounded-[3rem] p-12 border border-slate-100 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                <Info className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">Planning your trip?</h3>
              <p className="text-slate-600">
                We've partnered with local hotels to provide discounted rates for visiting GUI families. Contact the Visitor Center for more information on local accommodations and dining.
              </p>
              <ul className="space-y-2 text-sm text-slate-500 font-medium">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Free parking for tour attendees</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> ADA compliant campus facilities</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Dining hall vouchers included in tours</li>
              </ul>
            </div>
            <div className="h-full min-h-[300px] bg-slate-200 rounded-[2.5rem] overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700 shadow-inner">
               {/* Mock Map Background */}
               <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover opacity-50"
                alt="Map Background"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="p-4 bg-white rounded-full shadow-2xl animate-bounce">
                   <MapPin className="h-8 w-8 text-primary" />
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default Visit;
