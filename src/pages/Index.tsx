import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import QuickLinks from "@/components/landing/QuickLinks";
import StatsSection from "@/components/landing/StatsSection";
import NewsSection from "@/components/landing/NewsSection";
import AcademicPrograms from "@/components/landing/AcademicPrograms";
import CampusLife from "@/components/landing/CampusLife";
import ResearchSection from "@/components/landing/ResearchSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import EventsSection from "@/components/landing/EventsSection";
import GlobalImpact from "@/components/landing/GlobalImpact";
import AdmissionsCTA from "@/components/landing/AdmissionsCTA";

const Index = () => (
  <div className="min-h-screen bg-background selection:bg-primary/10 selection:text-primary">
    <Navbar />
    <main id="main-content">
      <HeroSection />
      <QuickLinks />
      <StatsSection />
      <NewsSection />
      <AcademicPrograms />
      <CampusLife />
      <ResearchSection />
      <TestimonialsSection />
      <EventsSection />
      <GlobalImpact />
      <AdmissionsCTA />
    </main>
    <Footer />
  </div>
);

export default Index;
