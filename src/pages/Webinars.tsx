import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Video, Calendar, Clock, User, ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const WebinarsPage = () => {
  const { toast } = useToast();
  const [webinars, setWebinars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebinars = async () => {
      const { data } = await supabase
        .from("webinars")
        .select("*")
        .order("start_time", { ascending: true });
      setWebinars(data || []);
      setLoading(false);
    };
    fetchWebinars();
  }, []);

  const handleRegister = (title: string) => {
    toast({
      title: "Registration successful!",
      description: `You have registered for "${title}". We'll email you the details.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Live <span className="gradient-text">Webinars</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Join expert-led sessions and interactive workshops.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-96 rounded-2xl" />)
            ) : webinars.length === 0 ? (
              <div className="col-span-full text-center py-20 border-2 border-dashed rounded-3xl">
                <Video className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">No webinars scheduled at the moment.</p>
              </div>
            ) : (
              webinars.map((w, i) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full flex flex-col border-border hover:border-primary/40 transition-all overflow-hidden group">
                    <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Video className="h-12 w-12 text-primary opacity-40 group-hover:scale-110 transition-transform" />
                      {w.is_recorded && (
                        <Badge className="absolute top-4 right-4 bg-emerald-500">Recorded</Badge>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{w.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{w.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(w.start_time).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(w.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full gap-2" 
                        onClick={() => handleRegister(w.title)}
                        variant={w.is_recorded ? "outline" : "default"}
                      >
                        {w.is_recorded ? (
                          <><PlayCircle className="h-4 w-4" /> Watch Recording</>
                        ) : (
                          "Register Now"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WebinarsPage;
