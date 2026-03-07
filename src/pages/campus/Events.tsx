import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const events = [
  { title: "Annual Science Fair", date: "Sep 15, 2026", location: "Grand Hall" },
  { title: "Guest Lecture: Dr. Jane Goodall", date: "Oct 2, 2026", location: "Auditorium A" },
  { title: "Homecoming Game", date: "Oct 10, 2026", location: "University Stadium" },
  { title: "Winter Symphony Concert", date: "Dec 5, 2026", location: "Music Center" },
];

const Events = () => {
  return (
    <PageLayout 
      title="News & Events" 
      description="What's happening on campus."
      backgroundImage="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-display font-bold mb-8">Upcoming Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((e) => (
            <Card key={e.title} className="hover:border-primary/40 transition-colors">
              <CardContent className="p-6">
                 <div className="flex items-center gap-2 text-primary mb-2 font-semibold">
                   <Calendar className="h-4 w-4" />
                   {e.date}
                 </div>
                 <h3 className="font-bold text-lg mb-1">{e.title}</h3>
                 <p className="text-sm text-muted-foreground">{e.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Events;
