import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";

const events = [
  {
    date: { day: "15", month: "MAR" },
    title: "Spring Open Day 2026",
    time: "9:00 AM – 4:00 PM",
    location: "Main Campus",
    type: "Admissions",
  },
  {
    date: { day: "22", month: "MAR" },
    title: "International Research Symposium: AI & Society",
    time: "10:00 AM – 6:00 PM",
    location: "Auditorium A",
    type: "Research",
  },
  {
    date: { day: "28", month: "MAR" },
    title: "Guest Lecture: Climate Policy in the 21st Century",
    time: "2:00 PM – 4:00 PM",
    location: "Hall of Sciences",
    type: "Lecture",
  },
  {
    date: { day: "05", month: "APR" },
    title: "Career Fair: Tech & Innovation",
    time: "11:00 AM – 5:00 PM",
    location: "Student Center",
    type: "Career",
  },
  {
    date: { day: "12", month: "APR" },
    title: "Annual Music & Arts Festival",
    time: "All Day Event",
    location: "Campus Grounds",
    type: "Culture",
  },
];

const EventsSection = () => (
  <section className="py-28 bg-background">
    <div className="container mx-auto px-6">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">Upcoming Events</p>
          <h2 className="text-4xl font-bold text-foreground md:text-5xl">What's Happening</h2>
        </div>
        <Link
          to="/news"
          className="hidden items-center gap-2 text-sm font-bold text-primary hover:underline md:flex"
        >
          View All Events <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to="/news"
              className="group flex items-center gap-6 rounded-xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:border-primary/30"
            >
              {/* Date block */}
              <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="text-2xl font-bold leading-none">{event.date.day}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{event.date.month}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {event.type}
                  </span>
                </div>
                <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {event.title}
                </h4>
                <div className="mt-1 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all hidden md:block" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default EventsSection;
