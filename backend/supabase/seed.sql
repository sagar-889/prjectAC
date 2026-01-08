-- Seed admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO public.users (email, password_hash, full_name, role)
VALUES ('admin@store.com', '$2a$10$rKZvVqVqVqVqVqVqVqVqVuK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed products
INSERT INTO public.products (id, name, description, price, category, images, colors, sizes, stock, is_featured, is_new)
VALUES 
  (gen_random_uuid(), 'Linen Oversized Blazer', 'A premium linen blazer for a relaxed yet sophisticated look.', 185.00, 'Women', '{"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800"}', '{"Sand", "Black", "Off-White"}', '{"XS", "S", "M", "L", "XL"}', 50, true, true),
  (gen_random_uuid(), 'Silk Slip Dress', 'Elegant silk slip dress perfect for evening wear.', 210.00, 'Women', '{"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800"}', '{"Black", "Champagne", "Emerald"}', '{"S", "M", "L"}', 30, true, false),
  (gen_random_uuid(), 'Merino Wool Sweater', 'Soft and warm merino wool sweater for daily comfort.', 145.00, 'Men', '{"https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=800"}', '{"Navy", "Grey", "Camel"}', '{"S", "M", "L", "XL"}', 40, true, true),
  (gen_random_uuid(), 'Cotton Twill Chinos', 'Classic cotton twill chinos with a modern slim fit.', 95.00, 'Men', '{"https://images.unsplash.com/photo-1473963476477-744db95ef573?auto=format&fit=crop&q=80&w=800"}', '{"Beige", "Olive", "Navy"}', '{"30", "32", "34", "36"}', 60, false, false),
  (gen_random_uuid(), 'Leather Chelsea Boots', 'Handcrafted leather boots with elasticated side panels.', 275.00, 'Men', '{"https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"}', '{"Brown", "Black"}', 25, true, false);
