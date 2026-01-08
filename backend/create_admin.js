import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function createAdmin() {
    const email = 'admin@store.com';
    const password = 'admin123';
    const fullName = 'Admin User';
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const result = await pool.query(
            `INSERT INTO users (email, password_hash, full_name, role) 
             VALUES ($1, $2, $3, 'admin') 
             ON CONFLICT (email) 
             DO UPDATE SET password_hash = $2, role = 'admin'
             RETURNING id, email, full_name, role`,
            [email, hashedPassword, fullName]
        );
        
        console.log('Admin user created/updated successfully:');
        console.log(result.rows[0]);
        console.log('\nLogin credentials:');
        console.log('Email:', email);
        console.log('Password:', password);
    } catch (error) {
        console.error('Error creating admin:', error.message);
    } finally {
        await pool.end();
    }
}

createAdmin();
