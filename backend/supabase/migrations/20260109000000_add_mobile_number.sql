-- Add mobile_number column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS mobile_number TEXT;

-- Add index for mobile_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_mobile_number ON public.users(mobile_number);
