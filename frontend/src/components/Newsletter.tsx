import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing!");
      setEmail("");
    }
  };

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
            Stay Connected
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-medium mb-6">
            Join Our World
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Subscribe for early access to new collections, exclusive offers, and stories from our artisan partners.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 px-4 bg-secondary border-0 placeholder:text-muted-foreground/60"
              required
            />
            <Button type="submit" variant="hero" size="lg">
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-6">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
