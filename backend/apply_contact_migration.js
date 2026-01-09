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

        // Apply contact_messages migration
        console.log('Applying contact_messages migration...');
        const migration = fs.readFileSync('./migrations_render/create_contact_messages.sql', 'utf8');
        await client.query(migration);
        console.log('Migration applied successfully!');

        // Verify the table exists
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'contact_messages';
        `);
        
        if (result.rows.length > 0) {
            console.log('✓ contact_messages table exists in production database');
        } else {
            console.log('✗ contact_messages table NOT found in production database');
        }
    } catch (err) {
        console.error('Error:', err.message);
        console.error('Full error:', err);
    } finally {
        await client.end();
    }
}

applyMigration();
