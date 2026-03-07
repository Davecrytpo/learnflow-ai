import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const events = [
  { date: "Aug 25, 2026", event: "Fall Semester Begins" },
  { date: "Sep 7, 2026", event: "Labor Day (No Classes)" },
  { date: "Oct 12-13, 2026", event: "Fall Break" },
  { date: "Nov 25-27, 2026", event: "Thanksgiving Recess" },
  { date: "Dec 11, 2026", event: "Last Day of Classes" },
  { date: "Dec 14-18, 2026", event: "Final Exams" },
];

const AcademicCalendar = () => {
  return (
    <PageLayout 
      title="Academic Calendar" 
      description="Key dates and deadlines for the 2026-2027 academic year."
      backgroundImage="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Fall 2026 Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {events.map((e, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <span className="font-bold text-primary">{e.date}</span>
                  <span className="text-foreground">{e.event}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AcademicCalendar;
