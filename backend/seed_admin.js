import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

async function seedAdmin() {
    const client = new pg.Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Connecting to database...');
        await client.connect();

        const email = 'admin@store.com';
        const password = 'admin123';
        const fullName = 'Store Admin';
        const role = 'admin';

        console.log(`Checking if user ${email} exists...`);
        const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            console.log('Admin user already exists. Updating role to admin...');
            await client.query('UPDATE users SET role = $1 WHERE email = $2', [role, email]);
        } else {
            console.log('Creating admin user...');
            const hashedPassword = await bcrypt.hash(password, 10);
            await client.query(
                'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4)',
                [email, hashedPassword, fullName, role]
            );
        }

        console.log('Admin user seeded successfully!');
    } catch (err) {
        console.error('Error seeding admin:', err.message);
    } finally {
        await client.end();
    }
}

seedAdmin();
