import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Discover = () => {
  return (
    <PageLayout 
      title="Discover Our Campus" 
      description="A historic setting with modern amenities, located in the heart of Innovation City."
      backgroundImage="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
           <img src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800" className="rounded-2xl shadow-lg" alt="Campus Green" />
           <img src="https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=800" className="rounded-2xl shadow-lg" alt="Library" />
        </div>
        
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-lg text-muted-foreground mb-8">
            Spread across 200 acres, our campus features gothic architecture, sprawling green spaces, and cutting-edge research facilities.
            Whether you're studying in the historic library or grabbing coffee at the student union, you'll feel right at home.
          </p>
          <Button size="lg" asChild>
            <Link to="/admissions/visit">Plan Your Visit</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Discover;
