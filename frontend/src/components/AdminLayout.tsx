import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import {
    BarChart3,
    Package,
    ShoppingBag,
    MessageSquare,
    Settings,
    LogOut,
    ChevronRight,
    Menu,
    X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
    const { isAdmin, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate("/");
        }
    }, [isAdmin, loading, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!isAdmin) return null;

    const menuItems = [
        { label: "Overview", icon: BarChart3, href: "/admin" },
        { label: "Products", icon: Package, href: "/admin/products" },
        { label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
        { label: "Reviews", icon: MessageSquare, href: "/admin/reviews" },
    ];

    return (
        <div className="flex min-h-screen bg-secondary/30">
            {/* Mobile Sidebar Overlay */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-md shadow-md"
                >
                    <Menu className="h-6 w-6" />
                </button>
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transition-transform duration-300 lg:translate-x-0 lg:static
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
                <div className="flex flex-col h-full">
                    <div className="p-6 flex justify-between items-center">
                        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
                            LAKSHMI
                        </Link>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-sm transition-colors
                    ${isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"}
                  `}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-border">
                        <Link to="/account" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground transition-colors">
                            <Settings className="h-5 w-5" />
                            <span className="font-medium">Account Settings</span>
                        </Link>
                        <button className="flex items-center gap-3 px-4 py-3 text-destructive w-full hover:bg-destructive/10 rounded-sm transition-colors">
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-border bg-background flex items-center justify-between px-8">
                    <h2 className="text-xl font-display font-medium capitalize">
                        {location.pathname.split("/").pop() || "Dashboard"}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest leading-none mb-1">Signed in as</p>
                            <p className="text-sm font-medium">Administrator</p>
                        </div>
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold">
                            A
                        </div>
                    </div>
                </header>

                <div className="p-8 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
