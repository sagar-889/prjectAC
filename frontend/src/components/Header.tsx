import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import SearchDialog from "./SearchDialog";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { openCart, itemCount } = useCart();

  const navLinks = [
    { name: "New Arrivals", href: "/shop?filter=new" },
    { name: "Shop All", href: "/shop" },
    { name: "Sale", href: "/shop?filter=sale" },
  ];

  if (isAdmin) {
    navLinks.push({ name: "Admin Panel", href: "/admin" });
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <h1 className="font-display text-2xl lg:text-3xl font-semibold tracking-tight">
                Lakshmi Collections
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 ml-12">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors link-underline"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              {user && (
                <Link to="/wishlist">
                  <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              <Link to={user ? "/account" : "/auth"}>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border animate-slide-up">
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <button
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-2 text-left flex items-center gap-2"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSearchOpen(true);
                }}
              >
                <Search className="h-5 w-5" /> Search
              </button>
            </nav>
          </div>
        )}
      </header>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
};

export default Header;
