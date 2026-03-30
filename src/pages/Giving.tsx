import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Gift, Building2, Users, Trophy, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GraduationCapIcon from "@/components/icons/GraduationCapIcon";
import { useToast } from "@/hooks/use-toast";

const Giving = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment gateway
    setTimeout(() => {
      setLoading(false);
      toast({ 
        title: "Thank you for your generosity!", 
        description: "Your donation has been received. A receipt has been sent to your email." 
      });
      setAmount("");
    }, 2000);
  };

  const funds = [
    { name: "Student Scholarships", icon: GraduationCapIcon, desc: "Support the next generation of leaders through merit and need-based aid." },
    { name: "Research & Innovation", icon: Building2, desc: "Fund ground-breaking research in medicine, technology, and humanities." },
    { name: "Campus Development", icon: Trophy, desc: "Help us build world-class facilities and modern learning environments." },
    { name: "Global Impact Fund", icon: Heart, desc: "Sponsor community outreach and international development programs." }
  ];

  return (
    <PageLayout 
      title="Support GUI" 
      description="Your contribution helps us redefine the future of higher education."
      backgroundImage="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6 text-slate-900">Investing in Potential</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Philanthropy is the cornerstone of our institution. Every gift, regardless of size, contributes to our mission of academic excellence and global innovation. Together, we can ensure that every student has the resources to succeed.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {funds.map((fund, i) => (
                <Card key={i} className="border-slate-200 hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <fund.icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-bold mb-2">{fund.name}</h3>
                    <p className="text-sm text-muted-foreground">{fund.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="rounded-3xl shadow-xl border-slate-200 overflow-hidden sticky top-24">
            <CardHeader className="bg-slate-900 text-white p-8">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Gift className="h-6 w-6 text-primary" /> Make a Gift
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleDonate} className="space-y-8">
                <div className="grid grid-cols-3 gap-3">
                  {['25', '50', '100', '250', '500', '1000'].map((val) => (
                    <Button 
                      key={val}
                      type="button" 
                      variant={amount === val ? "default" : "outline"}
                      className="h-12 rounded-xl"
                      onClick={() => setAmount(val)}
                    >
                      ${val}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-amount">Custom Amount ($)</Label>
                  <Input 
                    id="custom-amount" 
                    placeholder="Enter amount" 
                    type="number" 
                    className="h-12 rounded-xl"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fund-select">Designation</Label>
                  <select className="w-full h-12 rounded-xl border border-input bg-background px-4">
                    <option>Greatest Need (General Fund)</option>
                    <option>Scholarships</option>
                    <option>Research</option>
                    <option>Athletics</option>
                  </select>
                </div>

                <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg font-bold bg-primary text-white" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : "Complete Donation"}
                </Button>

                <p className="text-center text-xs text-muted-foreground px-4">
                  By donating, you agree to our terms. Your gift is tax-deductible to the extent allowed by law.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Giving;
