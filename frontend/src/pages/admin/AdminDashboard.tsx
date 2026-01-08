import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService } from "@/services/adminService";
import { formatDistanceToNow } from "date-fns";
import {
    TrendingUp,
    Users,
    Package,
    ShoppingBag,
    ArrowUpRight,
    ArrowDownRight,
    Loader2
} from "lucide-react";

const AdminDashboard = () => {
    const [stats, setStats] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const statsData = await adminService.getDashboardStats();
            const ordersData = await adminService.getRecentOrders();
            const productsData = await adminService.getTopSellingProducts();

            const formattedStats = [
                { label: "Total Revenue", value: `₹${(statsData.total_revenue || 0).toLocaleString()}`, change: statsData.revenue_change, trending: "up", icon: TrendingUp },
                { label: "Active Users", value: (statsData.active_users || 0).toString(), change: statsData.users_change, trending: "up", icon: Users },
                { label: "Total Products", value: (statsData.total_products || 0).toString(), change: statsData.products_change, trending: "neutral", icon: Package },
                { label: "New Orders", value: (statsData.new_orders || 0).toString(), change: statsData.orders_change, trending: "down", icon: ShoppingBag },
            ];

            setStats(formattedStats);
            setRecentOrders(ordersData);
            setTopProducts(productsData);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered": return "bg-emerald-100 text-emerald-700";
            case "processing": return "bg-amber-100 text-amber-700";
            case "cancelled": return "bg-rose-100 text-rose-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-none shadow-soft hover:shadow-hover transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                {stat.label}
                            </CardTitle>
                            <div className="p-2 bg-secondary rounded-sm">
                                <stat.icon className="h-4 w-4 text-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs mt-1 flex items-center gap-1">
                                <span className={`flex items-center font-medium ${stat.trending === "up" ? "text-emerald-600" :
                                    stat.trending === "down" ? "text-rose-600" : "text-muted-foreground"
                                    }`}>
                                    {stat.trending === "up" && <ArrowUpRight className="h-3 w-3" />}
                                    {stat.trending === "down" && <ArrowDownRight className="h-3 w-3" />}
                                    {stat.change}
                                </span>
                                <span className="text-muted-foreground">from last month</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <Card className="border-none shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-display text-xl">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentOrders.length > 0 ? recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-secondary rounded-sm flex items-center justify-center font-bold text-xs">
                                            #{order.id.slice(0, 4).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium">{order.profiles?.full_name || "Guest"}</p>
                                            <p className="text-muted-foreground xs:text-xs">
                                                {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">₹{Number(order.total).toFixed(2)}</p>
                                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-muted-foreground py-4">No orders yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="font-display text-xl">Top Selling Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {topProducts.length > 0 ? topProducts.map((product) => (
                                <div key={product.id} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-14 bg-secondary rounded-sm overflow-hidden border border-border">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-muted animate-pulse" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-muted-foreground xs:text-xs">{product.total_sales} sales total</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">₹{product.total_revenue.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">Revenue</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-muted-foreground py-4">No sales data yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
