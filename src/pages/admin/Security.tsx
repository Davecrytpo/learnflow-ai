import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock, FileText, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSecurity = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    registration_open: true,
    require_email_verification: true,
    force_2fa_admin: false,
    session_timeout_minutes: 60,
    public_profiles: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const { data, error } = await (supabase
        .from as any)("system_settings")
        .select("value")
        .eq("key", "security_config")
        .single();
      
      if (data) {
        setSettings({ ...settings, ...(data as any).value });
      } else if (error && error.code !== 'PGRST116') {
        // PGRST116 is "Row not found", which is fine, we use defaults
        console.error("Error fetching security settings:", error);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("system_settings")
      .upsert({ 
        key: "security_config", 
        value: settings,
        description: "Global security policies"
      });

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Security settings updated", description: "Policy changes have been applied." });
      
      // Log this action
      await supabase.from("audit_logs").insert({
        action: "update_security_settings",
        entity_type: "system",
        metadata: settings
      });
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Security</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Security & Compliance</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage access controls, registration policies, and session security.</p>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> Access Control
              </CardTitle>
              <CardDescription>Configure how users access the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Open Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new users to sign up without an invite.</p>
                </div>
                <Switch 
                  checked={settings.registration_open}
                  onCheckedChange={(c) => setSettings({...settings, registration_open: c})}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">Users must verify email before accessing courses.</p>
                </div>
                <Switch 
                  checked={settings.require_email_verification}
                  onCheckedChange={(c) => setSettings({...settings, require_email_verification: c})}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Force 2FA for Admins</Label>
                  <p className="text-sm text-muted-foreground">Require two-factor authentication for staff.</p>
                </div>
                <Switch 
                  checked={settings.force_2fa_admin}
                  onCheckedChange={(c) => setSettings({...settings, force_2fa_admin: c})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Privacy & Sessions
              </CardTitle>
              <CardDescription>Manage user visibility and session lifecycles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Public Profiles</Label>
                  <p className="text-sm text-muted-foreground">Allow user profiles to be visible to other students.</p>
                </div>
                <Switch 
                  checked={settings.public_profiles}
                  onCheckedChange={(c) => setSettings({...settings, public_profiles: c})}
                />
              </div>
              <div className="space-y-2">
                <Label>Session Timeout (Minutes)</Label>
                <div className="flex gap-2">
                  {[15, 30, 60, 120].map((min) => (
                    <Button
                      key={min}
                      variant={settings.session_timeout_minutes === min ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({...settings, session_timeout_minutes: min})}
                    >
                      {min}m
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Auto-logout inactive users after this period.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button size="lg" onClick={handleSave} disabled={saving} className="min-w-[150px]">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Policies
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSecurity;
