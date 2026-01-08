import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-fashion.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text content */}
          <div className="order-2 lg:order-1 text-center lg:text-left animate-slide-up">
            <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
              Spring Collection 2026
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] mb-6">
              Timeless
              <br />
              <span className="italic">Elegance</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto lg:mx-0 mb-8">
              Discover our thoughtfully curated collection of timeless pieces designed for modern sophistication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/shop">
                <Button variant="hero" size="xl">
                  Shop Collection
                </Button>
              </Link>
              <Button variant="outline" size="xl">
                Our Story
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative aspect-[4/3] lg:aspect-[3/4] overflow-hidden">
              <img
                src={heroImage}
                alt="Fashion collection featuring elegant linen blazer and silk dress"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
