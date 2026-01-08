import { api } from "../lib/api";

export const adminService = {
    async getDashboardStats() {
        return api.getAdminStats();
    },

    async getRecentOrders(limit = 5) {
        const orders = await api.getAdminOrders();
        return orders.slice(0, limit);
    },

    async getTopSellingProducts(limit = 5) {
        // Since we don't have a dedicated top selling endpoint yet, we'll return an empty array or implement later
        // For now, let's just return an empty array to avoid errors
        return [];
    },

    async getAllOrders() {
        return api.getAdminOrders();
    },

    async updateOrderStatus(orderId: string, status: string) {
        return api.updateOrderStatus(orderId, status);
    },

    async getAllProducts() {
        return api.getAdminProducts();
    },

    async uploadProductImage(file: File) {
        // Upload logic would go here. For now, we'll simulate or skip
        // In a real app, this would upload to Cloudinary/S3 and return the URL
        console.log("Image upload requested but not fully implemented in backend yet");
        return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800";
    },

    async createProduct(productData: any) {
        return api.createProduct(productData);
    },

    async updateProduct(productId: string, productData: any) {
        return api.updateProduct(productId, productData);
    },

    async deleteProduct(productId: string) {
        return api.deleteProduct(productId);
    },

    async getAllReviews() {
        return api.getAdminReviews();
    },

    async deleteReview(reviewId: string) {
        return api.deleteReview(reviewId);
    }
};
