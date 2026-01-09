import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv/config';

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

        // Apply mobile_number migration
        console.log('Applying mobile_number migration...');
        const migration = fs.readFileSync('./supabase/migrations/20260109000000_add_mobile_number.sql', 'utf8');
        await client.query(migration);
        console.log('Migration applied successfully!');

        // Verify the column exists
        const result = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'mobile_number';
        `);
        
        if (result.rows.length > 0) {
            console.log('✓ mobile_number column exists in production database');
        } else {
            console.log('✗ mobile_number column NOT found in production database');
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

applyMigration();
