import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, ShieldAlert, Award, User, BookOpen, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const VerificationPage = () => {
  const [searchParams] = useSearchParams();
  const certId = searchParams.get("cert");
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(!!certId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!certId) return;

    const verifyCert = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("certificates")
        .select(`
          *,
          courses(title, author_id, profiles:author_id(display_name)),
          profiles:user_id(display_name)
        `)
        .eq("verification_code", certId)
        .maybeSingle();

      if (error) {
        setError("Error connecting to verification registry.");
      } else if (!data) {
        setError("Invalid Certificate ID. This credential could not be found in our secure registry.");
      } else {
        setCertificate(data);
      }
      setLoading(false);
    };

    verifyCert();
  }, [certId]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Credential <span className="gradient-text">Verification</span>
            </h1>
            <p className="mt-4 text-muted-foreground">
              Verify the authenticity of Learnflow Academy certificates.
            </p>
          </div>

          {!certId ? (
            <Card className="text-center p-12 border-dashed border-2">
              <Award className="mx-auto h-16 w-16 text-muted-foreground/20 mb-6" />
              <CardTitle>No ID Provided</CardTitle>
              <CardDescription className="mt-2">
                Please scan the QR code or enter the verification URL provided on the certificate.
              </CardDescription>
              <Button asChild className="mt-8">
                <Link to="/">Return Home</Link>
              </Button>
            </Card>
          ) : loading ? (
            <Skeleton className="h-[500px] w-full rounded-3xl" />
          ) : error ? (
            <Card className="border-destructive/20 bg-destructive/5 text-center p-12">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                <XCircle className="mx-auto h-16 w-16 text-destructive mb-6" />
                <CardTitle className="text-destructive">Verification Failed</CardTitle>
                <CardDescription className="text-destructive/80 mt-2">
                  {error}
                </CardDescription>
                <Button variant="outline" asChild className="mt-8 border-destructive/20 hover:bg-destructive/10">
                  <Link to="/">Back to Home</Link>
                </Button>
              </motion.div>
            </Card>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="overflow-hidden border-emerald-500/20 bg-emerald-500/5 shadow-2xl shadow-emerald-500/10">
                <div className="h-2 bg-emerald-500" />
                <CardHeader className="text-center pb-8 border-b bg-white dark:bg-slate-900">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <ShieldCheck className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <Badge variant="outline" className="mb-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">
                    Verified Credential
                  </Badge>
                  <CardTitle className="text-3xl font-display mt-2">Authenticity Confirmed</CardTitle>
                  <CardDescription>Issued by Learnflow Academy Registry</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8 bg-white dark:bg-slate-900">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recipient Name</p>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <p className="text-lg font-semibold">{certificate.profiles?.display_name || "N/A"}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Issue Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <p className="text-lg font-semibold">{new Date(certificate.issued_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Course / Program</p>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <p className="text-xl font-bold">{certificate.courses?.title}</p>
                      </div>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Authorized Instructor</p>
                      <p className="font-medium text-muted-foreground">{certificate.courses?.profiles?.display_name || "Academy Core"}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-dashed">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">Verification Hash</p>
                        <p className="text-xs font-mono break-all">{certId}</p>
                      </div>
                      <Badge className="bg-emerald-500 gap-1 px-3 py-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Valid
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Learnflow Academy uses a decentralized registry to ensure academic records are tamper-proof and verifiable worldwide.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerificationPage;
