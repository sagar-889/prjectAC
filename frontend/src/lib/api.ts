const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthToken = () => localStorage.getItem('auth_token');

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

export const api = {
  // Auth
  signUp: (email: string, password: string, fullName?: string) =>
    apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    }),

  signIn: (email: string, password: string) =>
    apiRequest('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => apiRequest('/api/auth/me'),

  // Cart
  getCart: () => apiRequest('/api/cart'),

  addToCart: (productId: string, quantity: number, size: string, color: string) =>
    apiRequest('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity, size, color }),
    }),

  updateCartItem: (id: string, quantity: number) =>
    apiRequest(`/api/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  removeFromCart: (id: string) =>
    apiRequest(`/api/cart/${id}`, {
      method: 'DELETE',
    }),

  // Wishlist
  getWishlist: () => apiRequest('/api/wishlist'),

  addToWishlist: (productId: string) =>
    apiRequest('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    }),

  removeFromWishlist: (productId: string) =>
    apiRequest(`/api/wishlist/${productId}`, {
      method: 'DELETE',
    }),

  // Admin
  getAdminStats: () => apiRequest('/api/admin/stats'),
  getAdminOrders: () => apiRequest('/api/admin/orders'),
  updateOrderStatus: (id: string, status: string) =>
    apiRequest(`/api/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  getAdminProducts: () => apiRequest('/api/admin/products'),
  createProduct: (productData: any) =>
    apiRequest('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),
  updateProduct: (id: string, productData: any) =>
    apiRequest(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),
  deleteProduct: (id: string) =>
    apiRequest(`/api/admin/products/${id}`, {
      method: 'DELETE',
    }),
  getAdminReviews: () => apiRequest('/api/admin/reviews'),
  deleteReview: (id: string) =>
    apiRequest(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  createOrder: (orderData: { items: any[], total: number, shipping_address: any }) =>
    apiRequest('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  verifyPayment: (paymentData: { order_id: string, razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string }) =>
    apiRequest('/api/orders/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  // Products
  getFeaturedProducts: (limit = 6) => apiRequest(`/api/products/featured?limit=${limit}`),
  getAllProducts: (params: string) => apiRequest(`/api/products?${params}`),
  getProductById: (id: string) => apiRequest(`/api/products/${id}`),

  // Orders
  getUserOrders: () => apiRequest('/api/orders'),
  createOrder: (orderData: any) =>
    apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  verifyPayment: (paymentData: any) =>
    apiRequest('/api/orders/verify-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};
