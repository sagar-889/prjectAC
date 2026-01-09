import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function checkDatabase() {
    const client = new pg.Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Connecting to production database...');
        await client.connect();
        console.log('Connected!\n');

        // Check all tables
        console.log('=== TABLES ===');
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        tables.rows.forEach(row => console.log(`✓ ${row.table_name}`));

        // Check orders table columns
        console.log('\n=== ORDERS TABLE COLUMNS ===');
        const orderColumns = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'orders'
            ORDER BY ordinal_position;
        `);
        orderColumns.rows.forEach(row => {
            console.log(`  ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });

        // Check order_items table columns
        console.log('\n=== ORDER_ITEMS TABLE COLUMNS ===');
        const orderItemColumns = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'order_items'
            ORDER BY ordinal_position;
        `);
        orderItemColumns.rows.forEach(row => {
            console.log(`  ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });

        console.log('\n✅ Database check complete!');

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

checkDatabase();
