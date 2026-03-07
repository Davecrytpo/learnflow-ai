import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, UploadCloud, Save, Loader2, Layout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const AdminBranding = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState({
    site_name: "Learnflow AI",
    primary_color: "#0f172a",
    logo_url: "",
    landing_hero_text: "Enterprise LMS for modern education."
  });

  useEffect(() => {
    const fetchTheme = async () => {
      setLoading(true);
      const { data } = await (supabase
        .from as any)("system_settings")
        .select("value")
        .eq("key", "appearance_config")
        .single();
      
      if (data) {
        setTheme({ ...theme, ...data.value });
      }
      setLoading(false);
    };
    fetchTheme();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("system_settings")
      .upsert({ 
        key: "appearance_config", 
        value: theme,
        description: "Site appearance and branding"
      });

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Branding updated", description: "Visual changes will be reflected shortly." });
      // In a real app, we might trigger a context refresh here
    }
    setSaving(false);
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Appearance</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Branding & Themes</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Customize the look and feel of your learning platform.
            </p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" /> Visual Identity
              </CardTitle>
              <CardDescription>Configure core brand elements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input 
                  value={theme.site_name} 
                  onChange={(e) => setTheme({...theme, site_name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Primary Brand Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    className="w-12 p-1 h-10"
                    value={theme.primary_color}
                    onChange={(e) => setTheme({...theme, primary_color: e.target.value})}
                  />
                  <Input 
                    className="flex-1" 
                    value={theme.primary_color}
                    onChange={(e) => setTheme({...theme, primary_color: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://..." 
                    value={theme.logo_url}
                    onChange={(e) => setTheme({...theme, logo_url: e.target.value})}
                  />
                  <Button variant="outline" size="icon">
                    <UploadCloud className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Recommended: 200x50px transparent PNG</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-primary" /> Content & Layout
              </CardTitle>
              <CardDescription>Manage landing page text and presets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Landing Hero Text</Label>
                <Input 
                  value={theme.landing_hero_text}
                  onChange={(e) => setTheme({...theme, landing_hero_text: e.target.value})}
                />
              </div>
              
              <div className="pt-4">
                <Label>Theme Presets</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <button 
                    className="border rounded-lg p-3 text-left hover:border-primary transition-colors flex flex-col gap-2"
                    onClick={() => setTheme({...theme, primary_color: "#0f172a"})}
                  >
                    <div className="h-4 w-full bg-slate-900 rounded-sm" />
                    <span className="text-xs font-medium">Slate Enterprise</span>
                  </button>
                  <button 
                    className="border rounded-lg p-3 text-left hover:border-primary transition-colors flex flex-col gap-2"
                    onClick={() => setTheme({...theme, primary_color: "#2563eb"})}
                  >
                    <div className="h-4 w-full bg-blue-600 rounded-sm" />
                    <span className="text-xs font-medium">Academic Blue</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button size="lg" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Publish Branding
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminBranding;
