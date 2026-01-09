import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

async function runMigration() {
    const client = new pg.Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Connected!');

        const migration = fs.readFileSync('./supabase/migrations/20260109000000_add_mobile_number.sql', 'utf8');
        console.log('Applying mobile_number migration...');
        await client.query(migration);
        console.log('Migration applied successfully!');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

runMigration();
