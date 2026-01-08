import { Link } from "react-router-dom";

const footerLinks = {
  shop: [
    { name: "New Arrivals", href: "#new" },
    { name: "Living", href: "#living" },
    { name: "Accessories", href: "#accessories" },
    { name: "Gift Cards", href: "#" },
  ],
  about: [
    { name: "Our Story", href: "#" },
    { name: "Sustainability", href: "#" },
    { name: "Artisan Partners", href: "#" },
    { name: "Press", href: "#" },
  ],
  support: [
    { name: "Contact Us", href: "#" },
    { name: "Shipping", href: "#" },
    { name: "Returns", href: "#" },
    { name: "FAQ", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-secondary py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/">
              <h2 className="font-display text-2xl font-semibold tracking-tight mb-4">
                Lakshmi Collections
              </h2>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Thoughtfully designed objects for conscious living. Each piece tells a story of craftsmanship and care.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display text-lg font-medium mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium mb-4">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Lakshmi Collections. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
