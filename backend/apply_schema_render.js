import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

async function runSchema() {
    const client = new pg.Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Connecting to Render Postgres...');
        await client.connect();
        console.log('Connected!');

        const schema = fs.readFileSync('./render_schema.sql', 'utf8');
        console.log('Applying Render-compatible schema...');
        await client.query(schema);
        console.log('Database initialized successfully!');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

runSchema();
