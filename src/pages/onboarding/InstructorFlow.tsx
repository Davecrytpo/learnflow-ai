import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { CheckCircle2, UploadCloud, Linkedin, ArrowRight, Users } from "lucide-react";

const InstructorFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    subject: "",
    experience: "",
    format: "",
    linkedin: "",
    bio: ""
  });

  const handleNext = () => setStep(step + 1);

  const handleSubmit = () => {
    // Navigate to signup with instructor role and pre-filled data
    // In a real app, we'd store this in a temporary state or pass via extensive query params
    navigate(`/signup?role=instructor&subject=${formData.subject}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      
      <div className="w-full max-w-2xl z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 text-accent mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-display font-bold">Apply to Teach</h1>
          <p className="text-muted-foreground mt-2">Join our network of expert verified instructors.</p>
        </div>

        <Card className="p-8 backdrop-blur-sm bg-card/80 border-primary/10 shadow-2xl">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>What is your primary teaching subject?</Label>
                  <Input 
                    placeholder="e.g. Data Science, Digital Marketing" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Select onValueChange={(v) => setFormData({...formData, experience: v})}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Format</Label>
                    <Select onValueChange={(v) => setFormData({...formData, format: v})}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recorded">Recorded Courses</SelectItem>
                        <SelectItem value="live">Live Sessions</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Both)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Professional Bio</Label>
                  <Textarea 
                    placeholder="Tell us about your background and teaching philosophy..." 
                    className="min-h-[100px]"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
              </div>

              <Button className="w-full h-11" onClick={handleNext} disabled={!formData.subject}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Verification Required</p>
                  To maintain quality, we verify all instructor profiles. Linking your professional profile helps speed this up.
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>LinkedIn Profile URL</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-10" 
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedin}
                      onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    />
                  </div>
                </div>

                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-accent/5 transition-colors cursor-pointer">
                  <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Upload Sample Lecture (Optional)</p>
                  <p className="text-xs text-muted-foreground mt-1">MP4 or MOV, max 50MB</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1 bg-gradient-brand" onClick={handleSubmit}>Submit Application</Button>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InstructorFlow;
