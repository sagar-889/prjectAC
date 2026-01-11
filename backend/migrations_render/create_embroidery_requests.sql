-- Create embroidery_requests table
CREATE TABLE IF NOT EXISTS embroidery_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    pincode VARCHAR(10),
    design_image_url TEXT NOT NULL,
    shipping_cost DECIMAL(10, 2) NOT NULL,
    design_cost DECIMAL(10, 2) DEFAULT 0,
    total_cost DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_embroidery_requests_user_id ON embroidery_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_embroidery_requests_status ON embroidery_requests(status);
CREATE INDEX IF NOT EXISTS idx_embroidery_requests_created_at ON embroidery_requests(created_at DESC);
