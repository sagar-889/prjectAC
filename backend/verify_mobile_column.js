import pg from 'pg';
import dotenv from 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

async function verifyColumn() {
    const client = new pg.Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Checking users table structure...');
        
        const result = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position;
        `);
        
        console.log('\nUsers table columns:');
        result.rows.forEach(row => {
            console.log(`  - ${row.column_name}: ${row.data_type}`);
        });
        
        const hasMobile = result.rows.some(row => row.column_name === 'mobile_number');
        console.log(`\n✓ mobile_number column ${hasMobile ? 'EXISTS' : 'MISSING'}`);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

verifyColumn();
