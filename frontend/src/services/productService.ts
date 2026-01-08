import { type Product } from "@/data/products";
import { api } from "@/lib/api";

export const productService = {
    async getFeaturedProducts(limit = 6): Promise<Product[]> {
        return api.getFeaturedProducts(limit);
    },

    async getAllProducts(filters: any): Promise<Product[]> {
        const params = new URLSearchParams();

        if (filters.category && filters.category !== 'All') {
            params.append('category', filters.category);
        }
        if (filters.search) {
            params.append('search', filters.search);
        }
        if (filters.minPrice) {
            params.append('minPrice', filters.minPrice.toString());
        }
        if (filters.maxPrice) {
            params.append('maxPrice', filters.maxPrice.toString());
        }

        return api.getAllProducts(params.toString());
    },

    async getProductById(id: string): Promise<Product> {
        return api.getProductById(id);
    }
};
