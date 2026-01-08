import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Image as ImageIcon
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
    DialogFooter
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";

interface Product {
    id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    stock: number;
    is_featured: boolean;
    is_new: boolean;
    images: string[];
    colors?: string[];
    sizes?: string[];
}

const AdminProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [uploading, setUploading] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Form state
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        colors: "",
        sizes: "",
        is_featured: false,
        is_new: true
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllProducts();
            setProducts(data as Product[]);
        } catch (error) {
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFiles(Array.from(e.target.files));
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            const imageUrls = [];
            for (const file of imageFiles) {
                const url = await adminService.uploadProductImage(file);
                imageUrls.push(url);
            }

            // Parse colors and sizes from comma-separated strings
            const colors = newProduct.colors
                .split(',')
                .map(c => c.trim())
                .filter(c => c.length > 0);
            
            const sizes = newProduct.sizes
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            await adminService.createProduct({
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock),
                images: imageUrls,
                colors,
                sizes
            });

            toast.success("Product added successfully");
            setIsAddDialogOpen(false);
            fetchProducts();
            setNewProduct({
                name: "",
                description: "",
                price: "",
                category: "",
                stock: "",
                colors: "",
                sizes: "",
                is_featured: false,
                is_new: true
            });
            setImageFiles([]);
        } catch (error: any) {
            toast.error("Error creating product: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await adminService.deleteProduct(id);
            toast.success("Product deleted");
            fetchProducts();
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const handleViewProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsViewDialogOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setNewProduct({
            name: product.name,
            description: product.description || "",
            price: product.price.toString(),
            category: product.category,
            stock: product.stock.toString(),
            colors: product.colors?.join(', ') || "",
            sizes: product.sizes?.join(', ') || "",
            is_featured: product.is_featured,
            is_new: product.is_new
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;
        
        setUploading(true);
        try {
            const imageUrls = [...(selectedProduct.images || [])];
            
            // Upload new images if any
            for (const file of imageFiles) {
                const url = await adminService.uploadProductImage(file);
                imageUrls.push(url);
            }

            const colors = newProduct.colors
                .split(',')
                .map(c => c.trim())
                .filter(c => c.length > 0);
            
            const sizes = newProduct.sizes
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            await adminService.updateProduct(selectedProduct.id, {
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock),
                images: imageUrls,
                colors,
                sizes
            });

            toast.success("Product updated successfully");
            setIsEditDialogOpen(false);
            fetchProducts();
            setImageFiles([]);
        } catch (error: any) {
            toast.error("Error updating product: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-10 bg-background border-border h-11"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" size="xl" className="h-11 px-4">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="hero" size="xl" className="h-11">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add New Product</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddProduct} className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <label htmlFor="p_name" className="text-sm font-medium">Product Name</label>
                                        <Input
                                            id="p_name"
                                            name="name"
                                            required
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label htmlFor="p_description" className="text-sm font-medium">Description</label>
                                        <textarea
                                            id="p_description"
                                            name="description"
                                            className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background resize-none"
                                            required
                                            value={newProduct.description}
                                            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="p_price" className="text-sm font-medium">Price ($)</label>
                                        <Input
                                            id="p_price"
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            required
                                            value={newProduct.price}
                                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="p_category" className="text-sm font-medium">Category</label>
                                        <Input
                                            id="p_category"
                                            name="category"
                                            required
                                            value={newProduct.category}
                                            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="p_stock" className="text-sm font-medium">Stock Quantity</label>
                                        <Input
                                            id="p_stock"
                                            name="stock"
                                            type="number"
                                            required
                                            value={newProduct.stock}
                                            onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2 flex items-center gap-2 pt-8">
                                        <input
                                            type="checkbox"
                                            id="is_featured"
                                            checked={newProduct.is_featured}
                                            onChange={e => setNewProduct({ ...newProduct, is_featured: e.target.checked })}
                                        />
                                        <label htmlFor="is_featured" className="text-sm font-medium">Featured Product</label>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label htmlFor="p_colors" className="text-sm font-medium">Colors (comma-separated)</label>
                                        <Input
                                            id="p_colors"
                                            name="colors"
                                            placeholder="e.g. Black, White, Navy"
                                            value={newProduct.colors}
                                            onChange={e => setNewProduct({ ...newProduct, colors: e.target.value })}
                                        />
                                        <p className="text-xs text-muted-foreground">Enter colors separated by commas</p>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label htmlFor="p_sizes" className="text-sm font-medium">Sizes (comma-separated)</label>
                                        <Input
                                            id="p_sizes"
                                            name="sizes"
                                            placeholder="e.g. S, M, L, XL"
                                            value={newProduct.sizes}
                                            onChange={e => setNewProduct({ ...newProduct, sizes: e.target.value })}
                                        />
                                        <p className="text-xs text-muted-foreground">Enter sizes separated by commas</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="p_images" className="text-sm font-medium block">Images</label>
                                    <div className="relative border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer group">
                                        <input
                                            id="p_images"
                                            name="images"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            {imageFiles.length > 0
                                                ? `${imageFiles.length} images selected`
                                                : "Click to upload or drag and drop"}
                                        </p>
                                        <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG or WebP (max. 2MB)</p>
                                    </div>
                                </div>

                                <DialogFooter className="pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit" variant="hero" disabled={uploading}>
                                        {uploading ? "Uploading..." : "Create Product"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="bg-background border border-border rounded-sm overflow-hidden shadow-soft">
                <Table>
                    <TableHeader className="bg-secondary/50">
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <p className="text-muted-foreground text-sm uppercase tracking-widest">Loading products...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((p) => (
                                <TableRow key={p.id} className="hover:bg-secondary/20 transition-colors group">
                                    <TableCell>
                                        <div className="w-10 h-12 bg-secondary rounded-sm overflow-hidden border border-border">
                                            {p.images?.[0] ? (
                                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell>
                                        <span className="text-xs bg-secondary px-2 py-1 rounded-sm uppercase tracking-wider font-medium text-muted-foreground">
                                            {p.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-body">${Number(p.price).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${p.stock > 10 ? "bg-emerald-500" : p.stock > 0 ? "bg-orange-500" : "bg-rose-500"}`} />
                                            {p.stock} in stock
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {p.is_featured && <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-accent/10 text-accent rounded-sm">Featured</span>}
                                            {p.is_new && <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-sm">New</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40 shadow-soft border-border">
                                                <DropdownMenuItem 
                                                    className="cursor-pointer gap-2"
                                                    onClick={() => handleViewProduct(p)}
                                                >
                                                    <Eye className="h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="cursor-pointer gap-2"
                                                    onClick={() => handleEditProduct(p)}
                                                >
                                                    <Edit className="h-4 w-4" /> Edit Product
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="cursor-pointer gap-2 text-rose-600 focus:text-rose-600"
                                                    onClick={() => handleDeleteProduct(p.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete Product
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* View Product Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Product Details</DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Product Name</label>
                                        <p className="text-lg font-medium mt-1">{selectedProduct.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Category</label>
                                        <p className="mt-1">{selectedProduct.category}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Price</label>
                                        <p className="text-lg font-medium mt-1">${Number(selectedProduct.price).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Stock</label>
                                        <p className="mt-1">{selectedProduct.stock} units</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Colors</label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedProduct.colors && selectedProduct.colors.length > 0 ? (
                                                selectedProduct.colors.map(color => (
                                                    <span key={color} className="px-3 py-1 bg-secondary text-sm rounded-sm">{color}</span>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground text-sm">No colors specified</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Sizes</label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedProduct.sizes && selectedProduct.sizes.length > 0 ? (
                                                selectedProduct.sizes.map(size => (
                                                    <span key={size} className="px-3 py-1 bg-secondary text-sm rounded-sm">{size}</span>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground text-sm">No sizes specified</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                                        <div className="flex gap-2 mt-2">
                                            {selectedProduct.is_featured && <span className="text-xs uppercase tracking-widest font-bold px-2 py-1 bg-accent/10 text-accent rounded-sm">Featured</span>}
                                            {selectedProduct.is_new && <span className="text-xs uppercase tracking-widest font-bold px-2 py-1 bg-primary/10 text-primary rounded-sm">New</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Description</label>
                                <p className="mt-2 text-sm leading-relaxed">{selectedProduct.description || 'No description available'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Images</label>
                                <div className="grid grid-cols-3 gap-4 mt-2">
                                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                        selectedProduct.images.map((img, idx) => (
                                            <div key={idx} className="aspect-square bg-secondary rounded-sm overflow-hidden border border-border">
                                                <img src={img} alt={`${selectedProduct.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground text-sm col-span-3">No images available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Product Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateProduct} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <label htmlFor="edit_name" className="text-sm font-medium">Product Name</label>
                                <Input
                                    id="edit_name"
                                    required
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label htmlFor="edit_description" className="text-sm font-medium">Description</label>
                                <textarea
                                    id="edit_description"
                                    className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background resize-none"
                                    required
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="edit_price" className="text-sm font-medium">Price ($)</label>
                                <Input
                                    id="edit_price"
                                    type="number"
                                    step="0.01"
                                    required
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="edit_category" className="text-sm font-medium">Category</label>
                                <Input
                                    id="edit_category"
                                    required
                                    value={newProduct.category}
                                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="edit_stock" className="text-sm font-medium">Stock Quantity</label>
                                <Input
                                    id="edit_stock"
                                    type="number"
                                    required
                                    value={newProduct.stock}
                                    onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 flex items-center gap-2 pt-8">
                                <input
                                    type="checkbox"
                                    id="edit_featured"
                                    checked={newProduct.is_featured}
                                    onChange={e => setNewProduct({ ...newProduct, is_featured: e.target.checked })}
                                />
                                <label htmlFor="edit_featured" className="text-sm font-medium">Featured Product</label>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label htmlFor="edit_colors" className="text-sm font-medium">Colors (comma-separated)</label>
                                <Input
                                    id="edit_colors"
                                    placeholder="e.g. Black, White, Navy"
                                    value={newProduct.colors}
                                    onChange={e => setNewProduct({ ...newProduct, colors: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label htmlFor="edit_sizes" className="text-sm font-medium">Sizes (comma-separated)</label>
                                <Input
                                    id="edit_sizes"
                                    placeholder="e.g. S, M, L, XL"
                                    value={newProduct.sizes}
                                    onChange={e => setNewProduct({ ...newProduct, sizes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="edit_images" className="text-sm font-medium block">Add More Images</label>
                            <div className="relative border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-secondary/50 transition-colors cursor-pointer group">
                                <input
                                    id="edit_images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <ImageIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    {imageFiles.length > 0
                                        ? `${imageFiles.length} new images selected`
                                        : "Click to add more images"}
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="hero" disabled={uploading}>
                                {uploading ? "Updating..." : "Update Product"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminProducts;
