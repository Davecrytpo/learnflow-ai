import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await (supabase.from as any)("newsletter_subs").insert({ email });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already subscribed", description: "This email is already on our list." });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Subscribed!", description: "You've successfully joined our community updates." });
      setEmail("");
    }
  };

  return (
    <section className="border-t border-border bg-secondary/30 py-24">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Stay in the loop</h2>
          <p className="mt-4 text-muted-foreground">
            Get latest academic news, course updates, and platform features delivered directly to your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 bg-background"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" size="lg" className="h-12 w-full bg-gradient-brand sm:w-auto" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
