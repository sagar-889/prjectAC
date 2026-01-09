import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const products = [
    {
        name: 'Linen Oversized Blazer',
        description: 'A premium linen blazer for a relaxed yet sophisticated look.',
        price: 185.00,
        category: 'Women',
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800'],
        colors: ['Sand', 'Black', 'Off-White'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        stock: 50,
        is_featured: true,
        is_new: true
    },
    {
        name: 'Silk Slip Dress',
        description: 'Elegant silk slip dress perfect for evening wear.',
        price: 210.00,
        category: 'Women',
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'],
        colors: ['Black', 'Champagne', 'Emerald'],
        sizes: ['S', 'M', 'L'],
        stock: 30,
        is_featured: true,
        is_new: false
    },
    {
        name: 'Merino Wool Sweater',
        description: 'Soft and warm merino wool sweater for daily comfort.',
        price: 145.00,
        category: 'Men',
        images: ['https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=800'],
        colors: ['Navy', 'Grey', 'Camel'],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 40,
        is_featured: true,
        is_new: true
    },
    {
        name: 'Cotton Twill Chinos',
        description: 'Classic cotton twill chinos with a modern slim fit.',
        price: 95.00,
        category: 'Men',
        images: ['https://images.unsplash.com/photo-1473963476477-744db95ef573?auto=format&fit=crop&q=80&w=800'],
        colors: ['Beige', 'Olive', 'Navy'],
        sizes: ['30', '32', '34', '36'],
        stock: 60,
        is_featured: false,
        is_new: false
    },
    {
        name: 'Leather Chelsea Boots',
        description: 'Handcrafted leather boots with elasticated side panels.',
        price: 275.00,
        category: 'Men',
        images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'],
        colors: ['Brown', 'Black'],
        sizes: ['7', '8', '9', '10', '11'],
        stock: 25,
        is_featured: true,
        is_new: false
    },
    {
        name: 'Cashmere Scarf',
        description: 'Luxuriously soft cashmere scarf in timeless colors.',
        price: 125.00,
        category: 'Accessories',
        images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800'],
        colors: ['Charcoal', 'Cream', 'Burgundy'],
        sizes: ['One Size'],
        stock: 35,
        is_featured: false,
        is_new: true
    },
    {
        name: 'Leather Tote Bag',
        description: 'Spacious leather tote bag perfect for everyday use.',
        price: 195.00,
        category: 'Accessories',
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800'],
        colors: ['Tan', 'Black', 'Cognac'],
        sizes: ['One Size'],
        stock: 20,
        is_featured: true,
        is_new: false
    },
    {
        name: 'Organic Cotton T-Shirt',
        description: 'Sustainable organic cotton t-shirt with a perfect fit.',
        price: 45.00,
        category: 'Men',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
        colors: ['White', 'Black', 'Grey', 'Navy'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 100,
        is_featured: false,
        is_new: false
    }
];

async function seedProducts() {
    try {
        console.log('Starting to seed products...');
        
        for (const product of products) {
            const result = await pool.query(
                `INSERT INTO products (name, description, price, category, images, colors, sizes, stock, is_featured, is_new)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 RETURNING id, name`,
                [
                    product.name,
                    product.description,
                    product.price,
                    product.category,
                    product.images,
                    product.colors,
                    product.sizes,
                    product.stock,
                    product.is_featured,
                    product.is_new
                ]
            );
            console.log(`✓ Created product: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
        }
        
        console.log(`\n✅ Successfully seeded ${products.length} products!`);
    } catch (error) {
        console.error('Error seeding products:', error.message);
    } finally {
        await pool.end();
    }
}

seedProducts();
