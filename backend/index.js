import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import crypto from 'crypto';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Log Razorpay initialization
console.log('Razorpay initialized:', !!razorpay);
console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'Missing');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Middleware to verify admin role
const authenticateAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });

        try {
            const result = await pool.query('SELECT role FROM users WHERE id = $1', [user.id]);
            if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }
            req.user = user;
            next();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

// Middleware to verify Admin role
const isAdmin = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', database: 'connected' });
});

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, full_name, mobile_number } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (email, password_hash, full_name, mobile_number) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, mobile_number, role, created_at',
            [email, hashedPassword, full_name, mobile_number]
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ user, token });
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const { password_hash, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, email, full_name, mobile_number, avatar_url, role, created_at FROM users WHERE id = $1', [req.user.id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cart Routes
app.get('/api/cart', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, p.name, p.price, p.images, p.category 
            FROM cart_items c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = $1
        `, [req.user.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/cart', authenticateToken, async (req, res) => {
    try {
        const { product_id, quantity, size, color } = req.body;
        const result = await pool.query(
            'INSERT INTO cart_items (user_id, product_id, quantity, size, color) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, product_id, quantity, size, color]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/cart/:id', authenticateToken, async (req, res) => {
    try {
        const { quantity } = req.body;
        const result = await pool.query(
            'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [quantity, req.params.id, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/cart/:id', authenticateToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Wishlist Routes
app.get('/api/wishlist', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT w.product_id, p.name, p.price, p.images, p.category 
            FROM wishlist w 
            JOIN products p ON w.product_id = p.id 
            WHERE w.user_id = $1
        `, [req.user.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/wishlist', authenticateToken, async (req, res) => {
    try {
        const { product_id } = req.body;
        await pool.query(
            'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) ON CONFLICT (user_id, product_id) DO NOTHING',
            [req.user.id, product_id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/wishlist/:productId', authenticateToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2', [req.user.id, req.params.productId]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Product Routes
app.get('/api/products', async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice } = req.query;
        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (category && category !== 'All') {
            query += ` AND category = $${paramCount}`;
            params.push(category);
            paramCount++;
        }

        if (search) {
            query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }

        if (minPrice) {
            query += ` AND price >= $${paramCount}`;
            params.push(minPrice);
            paramCount++;
        }

        if (maxPrice) {
            query += ` AND price <= $${paramCount}`;
            params.push(maxPrice);
            paramCount++;
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/products/featured', async (req, res) => {
    try {
        const limit = req.query.limit || 6;
        const result = await pool.query(
            'SELECT * FROM products WHERE is_featured = true ORDER BY created_at DESC LIMIT $1',
            [limit]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Review Routes
app.get('/api/reviews', async (req, res) => {
    try {
        const { product_id } = req.query;
        let query = `
            SELECT r.*, u.full_name, u.avatar_url 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
        `;
        const params = [];

        if (product_id) {
            query += ' WHERE r.product_id = $1';
            params.push(product_id);
        }

        query += ' ORDER BY r.created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/reviews', authenticateToken, async (req, res) => {
    try {
        const { product_id, rating, comment } = req.body;
        const result = await pool.query(
            'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, product_id, rating, comment]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Order Routes
app.post('/api/orders/create', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { items, total, shipping_address } = req.body;

        console.log('Creating order with data:', { items, total, shipping_address });

        // 1. Create order in database
        const orderResult = await client.query(
            'INSERT INTO orders (user_id, total, status, shipping_address) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, total, 'pending', shipping_address]
        );
        const order = orderResult.rows[0];
        console.log('Order created:', order.id);

        // 2. Create order items
        for (const item of items) {
            console.log('Creating order item:', item);
            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price, size, color) VALUES ($1, $2, $3, $4, $5, $6)',
                [order.id, item.product_id, item.quantity, item.price, item.size, item.color]
            );
        }

        // 3. Create Razorpay order
        console.log('Creating Razorpay order...');
        const options = {
            amount: Math.round(total * 100), // amount in smallest currency unit
            currency: "INR",
            receipt: `receipt_${order.id}`,
        };

        let rzpOrder;
        try {
            rzpOrder = await razorpay.orders.create(options);
            console.log('Razorpay order created:', rzpOrder.id);
        } catch (rzpError) {
            console.error('Razorpay error:', rzpError);
            throw new Error(`Razorpay order creation failed: ${rzpError.message}`);
        }

        // 4. Update order with Razorpay Order ID
        await client.query(
            'UPDATE orders SET razorpay_order_id = $1 WHERE id = $2',
            [rzpOrder.id, order.id]
        );

        await client.query('COMMIT');
        console.log('Order creation successful');
        res.json({ order, razorpayOrder: rzpOrder });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Order creation error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

app.post('/api/orders/verify', authenticateToken, async (req, res) => {
    try {
        const { order_id, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            await pool.query(
                'UPDATE orders SET status = $1, razorpay_payment_id = $2 WHERE id = $3',
                ['processing', razorpay_payment_id, order_id]
            );
            res.json({ success: true });
        } else {
            res.status(400).json({ error: 'Invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Order Routes
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT o.*, 
                   json_agg(
                       json_build_object(
                           'id', oi.id,
                           'quantity', oi.quantity,
                           'price', oi.price,
                           'size', oi.size,
                           'color', oi.color,
                           'products', json_build_object(
                               'id', p.id,
                               'name', p.name,
                               'images', p.images
                           )
                       )
                   ) as order_items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [req.user.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const { items, shipping_address, total } = req.body;
        
        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(total * 100), // Amount in paise
            currency: 'INR',
            receipt: `order_${Date.now()}`,
            payment_capture: 1,
            notes: {
                user_id: req.user.id
            }
        });
        
        // Create order in database with pending status
        const orderResult = await pool.query(
            'INSERT INTO orders (user_id, total, status, shipping_address, razorpay_order_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, total, 'pending', JSON.stringify(shipping_address), razorpayOrder.id]
        );
        
        const order = orderResult.rows[0];
        
        // Create order items
        for (const item of items) {
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price, size, color) VALUES ($1, $2, $3, $4, $5, $6)',
                [order.id, item.product_id, item.quantity, item.price, item.size, item.color]
            );
        }
        
        res.json({ 
            order,
            razorpayOrder: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify Razorpay payment
app.post('/api/orders/verify-payment', authenticateToken, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;
        
        // Verify signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");
        
        if (razorpay_signature === expectedSign) {
            // Update order status to completed
            await pool.query(
                'UPDATE orders SET status = $1, razorpay_payment_id = $2, razorpay_signature = $3 WHERE id = $4',
                ['processing', razorpay_payment_id, razorpay_signature, order_id]
            );
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ error: 'Invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Razorpay Webhook for payment status updates
app.post('/api/webhooks/razorpay', async (req, res) => {
    try {
        const webhookSignature = req.headers['x-razorpay-signature'];
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        // Verify webhook signature
        if (webhookSecret) {
            const expectedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(JSON.stringify(req.body))
                .digest('hex');

            if (webhookSignature !== expectedSignature) {
                return res.status(400).json({ error: 'Invalid webhook signature' });
            }
        }

        const event = req.body.event;
        const payload = req.body.payload.payment.entity;

        console.log('Razorpay Webhook Event:', event);

        // Handle different payment events
        switch (event) {
            case 'payment.captured':
                // Payment successful
                await pool.query(
                    'UPDATE orders SET status = $1 WHERE razorpay_order_id = $2',
                    ['processing', payload.order_id]
                );
                break;

            case 'payment.failed':
                // Payment failed
                await pool.query(
                    'UPDATE orders SET status = $1 WHERE razorpay_order_id = $2',
                    ['failed', payload.order_id]
                );
                break;

            case 'payment.authorized':
                // Payment authorized (for cards)
                await pool.query(
                    'UPDATE orders SET status = $1 WHERE razorpay_order_id = $2',
                    ['authorized', payload.order_id]
                );
                break;

            default:
                console.log('Unhandled webhook event:', event);
        }

        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Admin Routes
app.get('/api/admin/stats', authenticateToken, isAdmin, async (req, res) => {
    try {
        const totalRevenue = await pool.query("SELECT SUM(total) FROM orders WHERE status IN ('processing', 'shipped', 'delivered')");
        const activeUsers = await pool.query("SELECT COUNT(*) FROM users");
        const totalProducts = await pool.query("SELECT COUNT(*) FROM products");
        const newOrders = await pool.query("SELECT COUNT(*) FROM orders WHERE status = 'pending'");

        res.json({
            total_revenue: parseFloat(totalRevenue.rows[0].sum || 0),
            active_users: parseInt(activeUsers.rows[0].count),
            total_products: parseInt(totalProducts.rows[0].count),
            new_orders: parseInt(newOrders.rows[0].count),
            revenue_change: "+12.5%",
            users_change: "+3.2%",
            products_change: "0%",
            orders_change: "-5.4%"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/orders', authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT o.*, u.email as user_email, u.full_name as user_name 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admin/orders/:id/status', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status, tracking_number, tracking_url } = req.body;
        let query = 'UPDATE orders SET status = $1, updated_at = now()';
        const params = [status];
        let paramCount = 2;

        if (tracking_number) {
            query += `, tracking_number = $${paramCount}`;
            params.push(tracking_number);
            paramCount++;
        }

        if (tracking_url) {
            query += `, tracking_url = $${paramCount}`;
            params.push(tracking_url);
            paramCount++;
        }

        if (status === 'shipped') {
            query += `, shipped_at = now()`;
        }

        query += ` WHERE id = $${paramCount} RETURNING *`;
        params.push(req.params.id);

        const result = await pool.query(query, params);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/products', authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/products', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, description, price, category, images, colors, sizes, stock, is_featured, is_new } = req.body;
        const result = await pool.query(
            'INSERT INTO products (name, description, price, category, images, colors, sizes, stock, is_featured, is_new) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [name, description, price, category, images || [], colors || [], sizes || [], stock || 0, is_featured || false, is_new || false]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, description, price, category, images, colors, sizes, stock, is_featured, is_new } = req.body;
        const result = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3, category = $4, images = $5, colors = $6, sizes = $7, stock = $8, is_featured = $9, is_new = $10 WHERE id = $11 RETURNING *',
            [name, description, price, category, images || [], colors || [], sizes || [], stock || 0, is_featured || false, is_new || false, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/reviews', authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.*, u.full_name, u.email, p.name as product_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            JOIN products p ON r.product_id = p.id 
            ORDER BY r.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/admin/reviews/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM reviews WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
