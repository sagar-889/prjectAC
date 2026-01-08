import { api } from "@/lib/api";

export const orderService = {
    async getUserOrders() {
        return api.getUserOrders();
    },

    async createOrder(orderData: any) {
        return api.createOrder(orderData);
    }
};
