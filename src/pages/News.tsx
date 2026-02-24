import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, Calendar, ArrowRight, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const NewsPage = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });
      setNews(data || []);
      setLoading(false);
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Academic <span className="gradient-text">News</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Stay updated with the latest from the Learnflow community.
            </p>
          </div>

          <div className="space-y-8">
            {loading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-2xl" />)
            ) : news.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed rounded-3xl">
                <Newspaper className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">No news articles published yet.</p>
              </div>
            ) : (
              news.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden border-border hover:border-primary/40 transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={item.is_important ? "destructive" : "secondary"}>
                          {item.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-2xl font-bold">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.content}
                      </p>
                      <Button variant="link" className="px-0 mt-4 text-primary">
                        Read full article <ArrowRight className="ml-2 h-4 w-4" />
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

export default NewsPage;
