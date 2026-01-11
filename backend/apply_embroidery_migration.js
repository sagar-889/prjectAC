import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function applyMigration() {
    const client = new pg.Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Connecting to production database...');
        await client.connect();
        console.log('Connected!');

        console.log('Applying embroidery_requests migration...');
        const migration = fs.readFileSync('./migrations_render/create_embroidery_requests.sql', 'utf8');
        await client.query(migration);
        console.log('✓ Migration applied successfully!');

        // Verify the table exists
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'embroidery_requests';
        `);
        
        if (result.rows.length > 0) {
            console.log('✓ embroidery_requests table exists in production database');
        } else {
            console.log('✗ embroidery_requests table NOT found in production database');
        }

        console.log('\n✅ Embroidery requests table is ready!');

    } catch (err) {
        console.error('Error:', err.message);
        console.error('Full error:', err);
    } finally {
        await client.end();
    }
}

applyMigration();
