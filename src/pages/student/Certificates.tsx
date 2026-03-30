import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Award, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentCertificates = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const { data } = await apiClient.db
          .from("certificates")
          .select("*, courses(title)")
          .eq("user_id", user.id)
          .order("issued_at", { ascending: false })
          .execute();
        setCerts(data || []);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Certificates</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Your certificates</h1>
            <p className="mt-2 text-sm text-muted-foreground">Download or share your earned credentials.</p>
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Earned certificates</CardTitle>
            <Award className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : certs.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl">
                <Award className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No certificates earned yet. Keep learning!</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {certs.map(c => (
                  <div key={c.id} className="group relative rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:shadow-primary/5">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Award className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-foreground line-clamp-1">{c.courses?.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Issued {new Date(c.issued_at).toLocaleDateString()}</p>
                    <div className="mt-6 flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-2 rounded-lg">
                        <Download className="h-3.5 w-3.5" /> Download
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentCertificates;
