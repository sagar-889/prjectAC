import { useState, useEffect } from "react";
import {
    Star,
    Trash2,
    MessageSquare,
    Search,
    ExternalLink
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
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    user_id: string;
    product_id: string;
    full_name: string;
    email: string;
    product_name: string;
}

const AdminReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllReviews();
            setReviews(data as any);
        } catch (error) {
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            await adminService.deleteReview(id);
            toast.success("Review deleted");
            fetchReviews();
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    const filteredReviews = reviews.filter(r =>
        r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search reviews, products, or users..."
                        className="pl-10 bg-background border-border h-11"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-background border border-border rounded-sm overflow-hidden shadow-soft">
                <Table>
                    <TableHeader className="bg-secondary/50">
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead className="w-[400px]">Comment</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                                    Loading reviews...
                                </TableCell>
                            </TableRow>
                        ) : filteredReviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                                    No reviews found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReviews.map((review) => (
                                <TableRow key={review.id} className="hover:bg-secondary/20 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{review.product_name}</span>
                                            <Link to={`/product/${review.product_id}`} target="_blank">
                                                <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                            </Link>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{review.full_name || "Guest"}</p>
                                            <p className="text-xs text-muted-foreground">{review.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-start gap-3">
                                            <MessageSquare className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                                            <p className="text-sm italic text-muted-foreground leading-relaxed">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                            onClick={() => handleDeleteReview(review.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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

export default AdminReviews;
