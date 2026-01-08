import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { User, Heart, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { useAuth } from "@/contexts/AuthContext";

const Account = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { icon: User, label: "Profile", href: "/account" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Package, label: "Orders", href: "/orders" },
  ];

  return (
    <>
      <Helmet>
        <title>My Account | Lakshmi Collections</title>
        <meta name="description" content="Manage your account, wishlist, and order history." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <CartSidebar />

        <main className="pt-20 lg:pt-24">
          <div className="container mx-auto px-6 py-8 lg:py-12">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Account</span>
            </nav>
            <h1 className="font-display text-4xl md:text-5xl font-medium">
              My Account
            </h1>
          </div>

          <div className="container mx-auto px-6 pb-24">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-secondary p-6 rounded-sm">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium">{user.email}</p>
                  </div>

                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-background rounded-sm transition-colors"
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-background rounded-sm transition-colors w-full text-left text-destructive"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </nav>
                </div>
              </div>

              {/* Main content */}
              <div className="md:col-span-2">
                <div className="bg-secondary p-8 rounded-sm">
                  <h2 className="font-display text-2xl font-medium mb-6">Account Details</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Member Since</label>
                      <p className="font-medium">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick links */}
                <div className="grid sm:grid-cols-2 gap-6 mt-8">
                  <Link
                    to="/wishlist"
                    className="bg-secondary p-6 rounded-sm hover:bg-muted transition-colors group"
                  >
                    <Heart className="h-8 w-8 mb-4 group-hover:text-accent transition-colors" />
                    <h3 className="font-display text-lg font-medium mb-1">Wishlist</h3>
                    <p className="text-sm text-muted-foreground">
                      View your saved items
                    </p>
                  </Link>
                  <Link
                    to="/orders"
                    className="bg-secondary p-6 rounded-sm hover:bg-muted transition-colors group"
                  >
                    <Package className="h-8 w-8 mb-4 group-hover:text-accent transition-colors" />
                    <h3 className="font-display text-lg font-medium mb-1">Orders</h3>
                    <p className="text-sm text-muted-foreground">
                      Track your orders
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Account;
