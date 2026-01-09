import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function fixContactTable() {
    const client = new pg.Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Connecting to production database...');
        await client.connect();
        console.log('Connected!');

        // Check if table exists
        const tableCheck = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'contact_messages';
        `);

        if (tableCheck.rows.length > 0) {
            console.log('Table contact_messages already exists');
            
            // Check if status column exists
            const columnCheck = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'contact_messages' AND column_name = 'status';
            `);

            if (columnCheck.rows.length === 0) {
                console.log('Adding status column...');
                await client.query(`ALTER TABLE contact_messages ADD COLUMN status VARCHAR(50) DEFAULT 'new';`);
                console.log('✓ Status column added');
            } else {
                console.log('✓ Status column already exists');
            }

            // Create indexes if they don't exist
            console.log('Creating indexes...');
            await client.query(`CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);`);
            await client.query(`CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);`);
            console.log('✓ Indexes created');

        } else {
            console.log('Creating contact_messages table...');
            await client.query(`
                CREATE TABLE contact_messages (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    name VARCHAR(255) NOT NULL,
                    phone VARCHAR(20) NOT NULL,
                    message TEXT NOT NULL,
                    status VARCHAR(50) DEFAULT 'new',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            `);
            console.log('✓ Table created');

            console.log('Creating indexes...');
            await client.query(`CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);`);
            await client.query(`CREATE INDEX idx_contact_messages_status ON contact_messages(status);`);
            console.log('✓ Indexes created');
        }

        console.log('\n✅ Contact messages table is ready!');

    } catch (err) {
        console.error('Error:', err.message);
        console.error('Full error:', err);
    } finally {
        await client.end();
    }
}

fixContactTable();
