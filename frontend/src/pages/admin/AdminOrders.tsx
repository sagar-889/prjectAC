import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Eye,
    Download,
    Calendar,
    CreditCard,
    Truck,
    Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";

interface Order {
    id: string;
    user_id: string;
    status: string;
    total: number;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    created_at: string;
    shipping_address?: any;
    profiles?: {
        full_name: string;
        email: string;
    };
}

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllOrders();
            setOrders(data as any);
        } catch (error) {
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, status: string, tracking_number?: string, tracking_url?: string) => {
        try {
            await adminService.updateOrderStatus(orderId, status, tracking_number, tracking_url);
            toast.success(`Order status updated to ${status}`);
            fetchOrders();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered": return "bg-emerald-100 text-emerald-700";
            case "shipped": return "bg-blue-100 text-blue-700";
            case "processing": return "bg-amber-100 text-amber-700";
            case "cancelled": return "bg-rose-100 text-rose-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by order ID or customer name..."
                        className="pl-10 bg-background border-border h-11"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" size="xl" className="h-11 px-4">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button variant="outline" size="xl" className="h-11 px-4">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            <div className="bg-background border border-border rounded-sm overflow-hidden shadow-soft">
                <Table>
                    <TableHeader className="bg-secondary/50">
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                                    Loading orders...
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-secondary/20 transition-colors group">
                                    <TableCell className="font-mono text-xs font-medium">#{order.id.slice(0, 8).toUpperCase()}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{order.profiles?.full_name || "Guest"}</p>
                                            <p className="text-xs text-muted-foreground">{order.profiles?.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-body">₹{Number(order.total).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <CreditCard className="h-3 w-3 text-muted-foreground" />
                                                {order.razorpay_order_id ? "Razorpay" : "N/A"}
                                            </div>
                                            {order.razorpay_payment_id && (
                                                <span className="text-[10px] text-muted-foreground truncate w-24">
                                                    {order.razorpay_payment_id}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={order.status}
                                            onValueChange={(val) => updateOrderStatus(order.id, val)}
                                        >
                                            <SelectTrigger className={`h-8 w-32 border-none font-bold text-[10px] uppercase tracking-widest rounded-full ${getStatusColor(order.status)}`}>
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="processing">Processing</SelectItem>
                                                <SelectItem value="shipped">Shipped</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Order Details #{order.id.slice(0, 8).toUpperCase()}</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid md:grid-cols-2 gap-8 py-6">
                                                    <div className="space-y-4">
                                                        <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2">
                                                            <Calendar className="h-3 w-3" /> Order Info
                                                        </h4>
                                                        <div className="bg-secondary/50 p-4 rounded-sm space-y-2">
                                                            <p className="text-sm flex justify-between"><span>Date:</span> <span className="font-medium">{new Date(order.created_at).toLocaleString()}</span></p>
                                                            <p className="text-sm flex justify-between"><span>Status:</span> <span className={`uppercase text-[10px] tracking-widest font-bold px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>{order.status}</span></p>
                                                            <p className="text-sm flex justify-between border-t border-border pt-2 mt-2"><span>Total Amount:</span> <span className="font-bold text-lg">₹{Number(order.total).toFixed(2)}</span></p>
                                                        </div>

                                                        <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2 mt-6">
                                                            <Truck className="h-3 w-3" /> Shipping Tracking
                                                        </h4>
                                                        <div className="bg-secondary/50 p-4 rounded-sm space-y-3">
                                                            <div>
                                                                <label className="text-xs text-muted-foreground mb-1 block">Tracking Number</label>
                                                                <Input
                                                                    id={`tracking-${order.id}`}
                                                                    placeholder="Enter tracking number"
                                                                    defaultValue={(order as any).tracking_number || ""}
                                                                    className="h-9"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-muted-foreground mb-1 block">Tracking URL</label>
                                                                <Input
                                                                    id={`tracking-url-${order.id}`}
                                                                    placeholder="https://..."
                                                                    defaultValue={(order as any).tracking_url || ""}
                                                                    className="h-9"
                                                                />
                                                            </div>
                                                            <Button
                                                                size="sm"
                                                                className="w-full"
                                                                onClick={() => {
                                                                    const trackingNumber = (document.getElementById(`tracking-${order.id}`) as HTMLInputElement)?.value;
                                                                    const trackingUrl = (document.getElementById(`tracking-url-${order.id}`) as HTMLInputElement)?.value;
                                                                    updateOrderStatus(order.id, 'shipped', trackingNumber, trackingUrl);
                                                                }}
                                                            >
                                                                Update Tracking & Mark as Shipped
                                                            </Button>
                                                        </div>

                                                        <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2 mt-6">
                                                            <CreditCard className="h-3 w-3" /> Payment Detail
                                                        </h4>
                                                        <div className="bg-secondary/50 p-4 rounded-sm space-y-1">
                                                            <p className="text-xs text-muted-foreground">Order ID: {order.razorpay_order_id || "-"}</p>
                                                            <p className="text-xs text-muted-foreground">Payment ID: {order.razorpay_payment_id || "-"}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2">
                                                            <Truck className="h-3 w-3" /> Shipping Address
                                                        </h4>
                                                        <div className="bg-secondary/50 p-4 rounded-sm">
                                                            <p className="text-sm font-medium">{order.profiles?.full_name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {order.shipping_address ? (order.shipping_address as any).street : "No address stored."}
                                                            </p>
                                                        </div>

                                                        <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2 mt-6">
                                                            <Package className="h-3 w-3" /> Order Items
                                                        </h4>
                                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                                            {(order as any).order_items?.map((item: any) => (
                                                                <div key={item.id} className="flex justify-between items-center text-sm bg-secondary/30 p-2 rounded-sm">
                                                                    <div>
                                                                        <p className="font-medium">{item.products?.name}</p>
                                                                        <p className="text-[10px] text-muted-foreground">{item.quantity} x ₹{item.price} — {item.size} / {item.color}</p>
                                                                    </div>
                                                                    <p className="font-bold">₹{(item.quantity * item.price).toFixed(2)}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminOrders;
